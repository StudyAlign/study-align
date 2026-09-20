import io
import csv
import json
import zipfile
from datetime import datetime

from fastapi import Depends, APIRouter, status, HTTPException, Response

from sqlalchemy import exc
from typing import List, Union, Literal

import methods
from api import get_db, if_exists
from methods import create_csv

from model.base import Session
import model

import schema.interaction.interactions
from schema.interaction import InteractionEnum
from schema.interaction import InteractionOrderByFields
import schema.populated
import schema.participant
import schema.condition

router = APIRouter()

# TODO: get_active_logger_participant for all routes in interaction.py

@router.get("/interactions", response_model=List[Union[schema.interaction.interactions.GenericInteraction,
                                                       schema.interaction.interactions.MouseInteraction,
                                                       schema.interaction.interactions.DragInteraction,
                                                       schema.interaction.interactions.KeyboardInteraction,
                                                       schema.interaction.interactions.TouchInteraction]],
            dependencies=[Depends(methods.userAccessTokenValidator)])
async def read_interactions(study_id: int, type: schema.interaction.interactions.InteractionEnum, offset: int = 0,
                            limit: int = 100, order_by: InteractionOrderByFields = "id", direction: Literal["asc", "desc"] = "asc",
                            db: Session = Depends(get_db)):
    study = methods.read(db, model.Study, study_id)
    if_exists(study, "Study")

    interactions = methods.read_interactions(db, study_id, type, offset, limit, order_by, direction)
    if not interactions:
        raise HTTPException(status_code=409, detail="Study has no interactions")

    return interactions


@router.get("/interactions/count", response_model=int, dependencies=[Depends(methods.userAccessTokenValidator)])
async def read_interaction_count(study_id: int, type: schema.interaction.interactions.InteractionBaseEnum, db: Session = Depends(get_db)):
    study = methods.read(db, model.Study, study_id)
    if_exists(study, "Study")
    interaction_count = methods.interaction_count(db, study_id, type)
    return interaction_count


@router.get("/interactions/counts", response_model=schema.interaction.interactions.InteractionCounts, dependencies=[Depends(methods.userAccessTokenValidator)])
async def read_interaction_counts(study_id: int, db: Session = Depends(get_db)):
    study = methods.read(db, model.Study, study_id)
    if_exists(study, "Study")
    interaction_count = methods.interaction_counts(db, study_id)
    return interaction_count


@router.get("/interactions/timeline", response_model=List[schema.interaction.interactions.InteractionTimelineBucket], dependencies=[Depends(methods.userAccessTokenValidator)])
async def read_interaction_timeline(study_id: int, db: Session = Depends(get_db)):
    study = methods.read(db, model.Study, study_id)
    if_exists(study, "Study")
    return methods.interaction_timeline(db, study_id)


@router.get("/interactions/export", response_class=Response, dependencies=[Depends(methods.userAccessTokenValidator)])
def export_interaction_data(study_id: int, db: Session = Depends(get_db)):
    study = methods.read(db, model.Study, study_id)
    if_exists(study, "Study")

    interaction_types = [
        InteractionEnum.generic,
        InteractionEnum.mouse,
        InteractionEnum.drag,
        InteractionEnum.keyboard,
        InteractionEnum.touch
    ]

    zip_buffer = io.BytesIO()
    try:
        with zipfile.ZipFile(zip_buffer, 'w', zipfile.ZIP_DEFLATED) as zip_file:
            for interaction_type in interaction_types:
                #TODO: consider timezone offset?
                zip_info = zipfile.ZipInfo(f'{interaction_type}.csv', datetime.now().timetuple()[:6])
                keys = methods.get_keys(interaction_type)
                rows = methods.export_interaction(db, study_id, interaction_type)
                csv_data = create_csv(keys, rows)
                zip_file.writestr(zip_info, csv_data)

            participant_keys = [column.key for column in model.Participant.__table__.columns]
            participant_rows = db.query(model.Participant).filter(
                model.Participant.study_id == study_id).order_by(model.Participant.id.asc()).all()
            csv_data = create_csv(participant_keys, participant_rows)
            zip_info = zipfile.ZipInfo(f'participants.csv', datetime.now().timetuple()[:6])
            zip_file.writestr(zip_info, csv_data)

            participant_ids = [p.id for p in participant_rows]
            procedure_progress_keys = [column.key for column in model.ProcedureProgress.__table__.columns]
            procedure_progress_rows = db.query(model.ProcedureProgress).filter(
                model.ProcedureProgress.participant_id.in_(participant_ids)).order_by(model.ProcedureProgress.id.asc()).all()
            csv_data = create_csv(procedure_progress_keys, procedure_progress_rows)
            zip_info = zipfile.ZipInfo(f'procedure_progress.csv', datetime.now().timetuple()[:6])
            zip_file.writestr(zip_info, csv_data)

            # Native questionnaire responses (answers as a JSON column).
            form_response_keys = [column.key for column in model.FormResponse.__table__.columns]
            form_response_rows = db.query(model.FormResponse).filter(
                model.FormResponse.study_id == study_id).order_by(model.FormResponse.id.asc()).all()
            csv_data = create_csv(form_response_keys, form_response_rows)
            zip_info = zipfile.ZipInfo('form_responses.csv', datetime.now().timetuple()[:6])
            zip_file.writestr(zip_info, csv_data)

            # Native questionnaire structures, so answer keys can be mapped to the
            # questions they belong to. forms.json holds the full definitions;
            # form_items.csv is a flat key -> question lookup for quick analysis.
            forms = db.query(model.Form).filter(
                model.Form.study_id == study_id).order_by(model.Form.id.asc()).all()

            forms_json = json.dumps([
                {"id": f.id, "name": f.name, "version": f.version, "definition": f.definition}
                for f in forms
            ], indent=2, default=str)
            zip_info = zipfile.ZipInfo('forms.json', datetime.now().timetuple()[:6])
            zip_file.writestr(zip_info, forms_json.encode('utf-8'))

            item_sio = io.StringIO()
            item_writer = csv.writer(item_sio, delimiter='\t')
            item_writer.writerow(["form_id", "form_name", "item_key", "item_type", "question"])
            for f in forms:
                for page in (f.definition or {}).get("pages", []):
                    for item in page.get("items", []):
                        itype = item.get("type")
                        if itype == "display":
                            continue
                        if itype == "scale":
                            for row in item.get("config", {}).get("rows", []):
                                question = row.get("text") or (
                                    str(row.get("left", "")) + " / " + str(row.get("right", "")))
                                item_writer.writerow([f.id, f.name, row.get("key"), "scale_row", question])
                        else:
                            item_writer.writerow([f.id, f.name, item.get("key"), itype, item.get("label")])
            zip_info = zipfile.ZipInfo('form_items.csv', datetime.now().timetuple()[:6])
            zip_file.writestr(zip_info, item_sio.getvalue().encode('utf-16'))
            item_sio.close()

        zip_buffer.seek(0)
        headers = {"Content-Disposition": f"attachment; filename=data_export-{study.name.replace(' ', '_')}.zip"}
        return Response(zip_buffer.getvalue(), headers=headers, media_type="application/zip")
    except:
        raise HTTPException(status_code=400, detail='Error processing the export data')
    finally:
        zip_buffer.close()


@router.post("/interaction/meta", response_model=schema.interaction.interactions.GenericInteraction)
async def log_meta_interaction(data: schema.interaction.interactions.MetaInteractionCreate,
                                         participant: schema.participant.Participant = Depends(
                                             methods.get_active_logger_participant),
                                         db: Session = Depends(get_db)):
    return methods.create_single_interaction(db, 'Generic Interaction', model.GenericInteraction, data, participant)


@router.post("/interaction/generic", response_model=schema.interaction.interactions.GenericInteraction)
async def log_generic_interaction_single(data: schema.interaction.interactions.GenericInteractionCreateSingle,
                                         participant: schema.participant.Participant = Depends(
                                             methods.get_active_logger_participant),
                                         db: Session = Depends(get_db)):
    methods.is_participating_in_condition(participant, data.condition_id)
    return methods.create_single_interaction(db, 'Generic Interaction', model.GenericInteraction, data, participant)


@router.post("/interaction/generic/bulk", status_code=status.HTTP_204_NO_CONTENT)
async def log_generic_interaction_bulk(data: schema.interaction.interactions.GenericInteractionCreateBulk,
                                       participant: schema.participant.Participant = Depends(
                                           methods.get_active_logger_participant),
                                       db: Session = Depends(get_db)):
    methods.is_participating_in_condition(participant, data.condition_id)
    methods.create_bulk_interaction(db, "Generic Interactions", model.GenericInteraction, data, participant)
    return


@router.post("/interaction/mouse", response_model=schema.interaction.interactions.MouseInteraction)
async def log_mouse_interaction_single(data: schema.interaction.interactions.MouseInteractionCreateSingle,
                                       participant: schema.participant.Participant = Depends(
                                           methods.get_active_logger_participant),
                                       db: Session = Depends(get_db)):
    methods.is_participating_in_condition(participant, data.condition_id)
    return methods.create_single_interaction(db, 'Mouse Interaction', model.MouseInteraction, data, participant)


@router.post("/interaction/mouse/bulk", status_code=status.HTTP_204_NO_CONTENT)
async def log_mouse_interaction_bulk(data: schema.interaction.interactions.MouseInteractionCreateBulk,
                                     participant: schema.participant.Participant = Depends(
                                         methods.get_active_logger_participant),
                                     db: Session = Depends(get_db)):
    methods.is_participating_in_condition(participant, data.condition_id)
    methods.create_bulk_interaction(db, "Mouse Interactions", model.MouseInteraction, data, participant)
    return


@router.post("/interaction/drag", response_model=schema.interaction.interactions.DragInteraction)
async def log_drag_interaction_single(data: schema.interaction.interactions.DragInteractionCreateSingle,
                                       participant: schema.participant.Participant = Depends(
                                           methods.get_active_logger_participant),
                                       db: Session = Depends(get_db)):
    methods.is_participating_in_condition(participant, data.condition_id)
    return methods.create_single_interaction(db, 'Drag Interaction', model.DragInteraction, data, participant)


@router.post("/interaction/drag/bulk", status_code=status.HTTP_204_NO_CONTENT)
async def log_drag_interaction_bulk(data: schema.interaction.interactions.DragInteractionCreateBulk,
                                     participant: schema.participant.Participant = Depends(
                                         methods.get_active_logger_participant),
                                     db: Session = Depends(get_db)):
    methods.is_participating_in_condition(participant, data.condition_id)
    methods.create_bulk_interaction(db, "Drag Interactions", model.DragInteraction, data, participant)
    return


@router.post("/interaction/keyboard", response_model=schema.interaction.interactions.KeyboardInteraction)
async def log_keyboard_interaction_single(data: schema.interaction.interactions.KeyboardInteractionCreateSingle,
                                          participant: schema.participant.Participant = Depends(
                                              methods.get_active_logger_participant),
                                          db: Session = Depends(get_db)):
    methods.is_participating_in_condition(participant, data.condition_id)
    return methods.create_single_interaction(db, 'Keyboard Interaction', model.KeyboardInteraction, data, participant)


@router.post("/interaction/keyboard/bulk", status_code=status.HTTP_204_NO_CONTENT)
async def log_keyboard_interaction_bulk(data: schema.interaction.interactions.KeyboardInteractionCreateBulk,
                                        participant: schema.participant.Participant = Depends(
                                            methods.get_active_logger_participant),
                                        db: Session = Depends(get_db)):
    methods.is_participating_in_condition(participant, data.condition_id)
    methods.create_bulk_interaction(db, "Keyboard Interactions", model.KeyboardInteraction, data, participant)
    return


@router.post("/interaction/touch", response_model=schema.interaction.interactions.TouchInteraction)
async def log_touch_interaction_single(data: schema.interaction.interactions.TouchInteractionCreateSingle,
                                       participant: schema.participant.Participant = Depends(
                                           methods.get_active_logger_participant),
                                       db: Session = Depends(get_db)):
    methods.is_participating_in_condition(participant, data.condition_id)
    try:
        touch_interaction = data.interaction
        touch_interaction_data = methods.prepare_interaction_data(data, participant)
        del touch_interaction_data['touches']
        del touch_interaction_data['changedTouches']
        del touch_interaction_data['targetTouches']

        touches = data.interaction.touches
        db_touches_data = [model.Touch(**touch.model_dump()) for touch in touches]

        db_touch_interaction = model.TouchInteraction(**touch_interaction_data)
        db.add(db_touch_interaction)
        db.add_all(db_touches_data)

        db.flush()

        changed_touches_uuid = [changed_touch.uuid for changed_touch in touch_interaction.changedTouches]
        target_touches_uuid = [target_touch.uuid for target_touch in touch_interaction.targetTouches]

        for db_touch in db_touches_data:
            db.add(model.TouchType(touch_interaction_id=db_touch_interaction.id, touch_id=db_touch.id, type="all"))
            if db_touch.uuid in changed_touches_uuid:
                db.add(
                    model.TouchType(touch_interaction_id=db_touch_interaction.id, touch_id=db_touch.id, type="changed"))
            if db_touch.uuid in target_touches_uuid:
                db.add(
                    model.TouchType(touch_interaction_id=db_touch_interaction.id, touch_id=db_touch.id, type="target"))

        db.commit()
        db.refresh(db_touch_interaction)
    except exc.SQLAlchemyError:
        raise HTTPException(status_code=409, detail="Failed to log touch interaction.")
    return db_touch_interaction


@router.post("/interaction/touch/bulk", status_code=status.HTTP_204_NO_CONTENT)
async def log_touch_interaction_bulk(data: schema.interaction.interactions.TouchInteractionCreateBulk,
                                     participant: schema.populated.ParticipantPopulated = Depends(
                                         methods.get_active_logger_participant),
                                     db: Session = Depends(get_db)):
    methods.is_participating_in_condition(participant, data.condition_id)
    try:
        # first create touch interactions and touches as bulk inserts
        interactions_bulk = []
        touches_bulk = []
        for touch_interaction in data.interactions:
            touch_interaction_data = touch_interaction.model_dump()
            touch_interaction_data['study_id'] = participant.study_id
            touch_interaction_data['participant_id'] = participant.id
            touch_interaction_data['condition_id'] = data.condition_id
            del touch_interaction_data['touches']
            del touch_interaction_data['changedTouches']
            del touch_interaction_data['targetTouches']
            interactions_bulk.append(touch_interaction_data)

            for touch in touch_interaction.touches:
                t = touch.model_dump()
                touches_bulk.append(t)

        db.execute(
            model.TouchInteraction.__table__.insert(),
            interactions_bulk
        )
        db.execute(
            model.Touch.__table__.insert(),
            touches_bulk
        )
        db.flush()

        # build a dictionary: {touch_interaction.uuuid: touch_interaction.id}
        # build a dictionary: {touch.uuuid: touch.id}
        touch_interactions_uuid = []
        all_touches_uuid = []
        for interaction in data.interactions:
            touch_interactions_uuid.append(interaction.uuid)
            for touch in interaction.touches:
                all_touches_uuid.append(touch.uuid)
        db_interactions = db.query(model.TouchInteraction.id, model.TouchInteraction.uuid). \
            filter(model.TouchInteraction.uuid.in_(touch_interactions_uuid)). \
            all()
        touch_interaction_index = {dbi.uuid: dbi.id for dbi in db_interactions}
        db_touches = db.query(model.Touch.id, model.Touch.uuid). \
            filter(model.Touch.uuid.in_(all_touches_uuid)). \
            all()
        touches_index = {dbt.uuid: dbt.id for dbt in db_touches}

        # then link the touches properly
        touch_type_bulk = []
        for touch_interaction in data.interactions:
            touch_interaction_db_id = touch_interaction_index.get(touch_interaction.uuid)

            touches_uuid = [touch.uuid for touch in touch_interaction.touches]
            changed_touches_uuid = [changed_touch.uuid for changed_touch in touch_interaction.changedTouches]
            target_touches_uuid = [target_touch.uuid for target_touch in touch_interaction.targetTouches]

            touch_ids = {touch_uuid: touches_index.get(touch_uuid) for touch_uuid in touches_uuid}

            for touch_db_uuid, touch_db_id in touch_ids.items():
                touch_type_bulk.append({"touch_interaction_id": touch_interaction_db_id, "touch_id": touch_db_id, "type": "all"})
                if touch_db_uuid in changed_touches_uuid:
                    touch_type_bulk.append(
                        {"touch_interaction_id": touch_interaction_db_id, "touch_id": touch_db_id, "type": "changed"})
                if touch_db_uuid in target_touches_uuid:
                    touch_type_bulk.append(
                        {"touch_interaction_id": touch_interaction_db_id, "touch_id": touch_db_id, "type": "target"})
        db.execute(
            model.TouchType.__table__.insert(),
            touch_type_bulk
        )
        db.commit()
    except exc.SQLAlchemyError:
        raise HTTPException(status_code=409, detail="Failed to log bulk of touch interactions.")
    return


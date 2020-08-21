from sqlalchemy.orm import Session

import model


def read_condition_ids_by_study(db: Session, study_id: int):
    condition_ids = db.query(model.Condition.id.label('id')). \
        filter(model.Condition.study_id == study_id).\
        all()
    result = [condition_id for condition_id, in condition_ids]
    return result

import uuid
from datetime import datetime
from getpass import getuser
from uuid import UUID

from fastapi import Depends, APIRouter, status, HTTPException, UploadFile
from fastapi.responses import FileResponse
from typing import List, Union, Literal

from sqlalchemy import or_, and_

from methods.dependencies.roles import StudyIdRoleCheck, GroupIdRoleCheck
from methods.dependencies.uploads import content_length_check, upload_file, delete_file
from methods.groups import get_group_logo_path
from methods.mail import get_group_invite_email_html, get_email_config
from model.base import Session
from api import get_db, if_exists, if_not_zero, slugify

import model

import methods

from methods import AuthMethod, UserRole, UserValidator

import schema.group
import schema.group_invite
import schema.group_member
import schema.api
from schema.participant import ParticipantEnum, ParticipantOrderByFields
from schema.questionnaire import QuestionnaireSystemEnum

from decouple import config

from os import path, rename

import aiofiles.os
from fastapi_mail import FastMail, MessageSchema, ConnectionConfig, MessageType


router = APIRouter()

ENTITY = "Group"


@router.get("/groups", response_model=List[schema.group.Group],
            dependencies=[Depends(methods.userAccessTokenValidator)])
async def read_groups(user: schema.user.User = Depends(UserValidator(strict_auth_method=True)),
                       db: Session = Depends(get_db)):
    if user.role.name == UserRole.RESEARCHER:
        return db.query(model.Group).join(model.GroupMember).filter(
            or_(model.Group.owner_id == user.id, model.GroupMember.user_id == user.id)).order_by(
            model.Group.id.desc()).all()
    groups = methods.read_list(db, model.Group)
    return groups


@router.post("/groups", response_model=schema.group.Group,
             dependencies=[Depends(methods.userAccessTokenValidator)])
async def create_group(group: schema.group.GroupCreate, db: Session = Depends(get_db)):
    owner = methods.read(db, model.User, group.owner_id)
    if_exists(owner, "User")
    group = group.model_dump()
    group['slug'] = slugify(group['name'])
    return methods.create(db, model.Group, group)


@router.get("/groups/{group_id}", response_model=schema.group.Group,
            dependencies=[Depends(methods.userAccessTokenValidator)])
async def read_group(group_id: int, db: Session = Depends(get_db)):
    group = methods.read(db, model.Group, group_id)
    if_exists(group, ENTITY)
    return group


GroupIdCheck = Depends(GroupIdRoleCheck())


@router.get("/group/{group_id}/members", response_model=List[schema.populated.GroupMemberPopulated],
            dependencies=[Depends(methods.userAccessTokenValidator)])
async def read_group_members(group_id: int = GroupIdCheck, db: Session = Depends(get_db)):
    group_members = methods.read_list_by(db, model.GroupMember, "group_id", group_id)
    return group_members


@router.delete("/group/{group_id}/members/{user_id}", status_code=status.HTTP_204_NO_CONTENT,
            dependencies=[Depends(methods.userAccessTokenValidator)])
async def remove_group_member(user_id: int, group_id: int = GroupIdCheck, db: Session = Depends(get_db)):
    group_member = methods.read_by_dict(db, model.GroupMember, {"group_id": group_id, "user_id": user_id})
    db.delete(group_member)
    db.commit()
    return


@router.patch("/groups/{group_id}", status_code=status.HTTP_204_NO_CONTENT,
              dependencies=[Depends(methods.userAccessTokenValidator)])
async def update_group(group_id: int = GroupIdCheck, group: schema.group.GroupUpdate = None,
                       db: Session = Depends(get_db)):
    if group.owner_id:
        owner = methods.read(db, model.User, group.owner_id)
        if_exists(owner, "User")

    db_group = methods.read(db, model.Group, group_id)

    if group.name:
        logo_path_old = get_group_logo_path(db_group.slug)
        group.slug = slugify(group.name)
        logo_path_new = get_group_logo_path(group.slug)

    group_update = methods.patch(db, model.Group, group, group_id)
    if_not_zero(group_update, ENTITY)

    if path.exists(logo_path_old):
        rename(logo_path_old, logo_path_new)
    return group_update


@router.delete("/groups/{group_id}", status_code=status.HTTP_204_NO_CONTENT,
               dependencies=[Depends(methods.userAccessTokenValidator)])
async def delete_group(group_id: int = GroupIdCheck, db: Session = Depends(get_db)):
    group = methods.read(db, model.Group, group_id)
    slug = group.slug
    db.delete(group)
    db.commit()
    logo_path = get_group_logo_path(slug)
    delete_file(logo_path)
    return


@router.post('/groups/{group_id}/logo', status_code=status.HTTP_204_NO_CONTENT,
             dependencies=[Depends(methods.userAccessTokenValidator)])
async def upload_group_logo(file: UploadFile, group_id: int = GroupIdCheck,
                            file_size: int = Depends(content_length_check), db: Session = Depends(get_db)):

    if file.content_type != "image/png":
        raise HTTPException(
            status_code=409,
            detail='Only PNG image files allowed',
        )

    group = methods.read(db, model.Group, group_id)

    logo_path = get_group_logo_path(group.slug)
    upload_file(file, file_size, logo_path)

    return


@router.get("/groups/{group_id}/logo", response_class=FileResponse)
async def read_group_logo(group_id: int, db: Session = Depends(get_db)):
    group = methods.read(db, model.Group, group_id)
    if_exists(group, ENTITY)

    logo_path = get_group_logo_path(group.slug)

    if path.exists(logo_path):
        return logo_path

    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail='File not found',
    )

@router.delete("/groups/{group_id}/logo", status_code=status.HTTP_204_NO_CONTENT,
               dependencies=[Depends(methods.userAccessTokenValidator)])
async def remove_logo(group_id: int = GroupIdCheck, db: Session = Depends(get_db)):
    group = methods.read(db, model.Group, group_id)

    logo_path = get_group_logo_path(group.slug)
    delete_file(logo_path)


# Define email config
email_config = get_email_config()

@router.get("/groups/{group_id}/invites", response_model=List[schema.group.Group],
            dependencies=[Depends(methods.userAccessTokenValidator)])
async def read_group_invites(group_id: int = GroupIdCheck, user: schema.user.User = Depends(UserValidator(strict_auth_method=True)),
                       db: Session = Depends(get_db)):
    return db.query(model.GroupInvite).join(model.Group).filter(
            and_(model.GroupInvite.group_id == group_id, model.Group.owner_id == user.id)).order_by(
            model.GroupInvite.id.desc()).all()


@router.post("/groups/{group_id}/invites", response_model=schema.group_invite.GroupInvite,
            dependencies=[Depends(methods.userAccessTokenValidator)])
async def group_invite(invite_body: schema.group_invite.GroupInviteBody, group_id: int = GroupIdCheck, db: Session = Depends(get_db)):
    user_id = invite_body.user_id
    group_member = methods.read_by_dict(db, model.GroupMember, {"group_id": group_id, "user_id": user_id})
    if group_member:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail='User is already a group member',
        )

    group_invite = methods.read_by_dict(db, model.GroupInvite, {"group_id": group_id, "user_id": user_id})
    if group_invite:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail='User has been already invited',
        )

    user = methods.read(db, model.User, user_id)
    if_exists(user, "User")

    invite = {
        "group_id": group_id,
        "user_id": user_id,
        "invited_by_id": user.id
    }
    group_invite = schema.group_invite.GroupInviteCreate(**invite)
    group_invite = methods.create(db, model.GroupInvite, group_invite)

    html = get_group_invite_email_html(group_invite.group.name, group_invite.token)

    message = MessageSchema(
        subject="StudyAlign group invite to " + group_invite.group.name,
        recipients=[group_invite.user.email],
        body=html,
        subtype=MessageType.html)

    fm = FastMail(email_config)
    await fm.send_message(message)

    return group_invite


@router.get("/groups/invite/{token}/accept", response_model=schema.group_member.GroupMember)
async def accept_group_invite(token: uuid.UUID, db: Session = Depends(get_db)):
    group_invite = methods.read_by(db, model.GroupInvite, "token", token)
    if_exists(group_invite, "GroupInvite")

    user = methods.read(db, model.User, group_invite.user_id)
    if_exists(user, "User")

    group = methods.read(db, model.Group, group_invite.group_id)
    if_exists(group, "Group")

    member = {
        "group_id": group.id,
        "user_id": user.id
    }
    group_member = schema.group_member.GroupMemberCreate(**member)
    group_member = methods.create(db, model.GroupMember, group_member, commit=False)
    db.delete(group_invite)
    db.commit()
    db.refresh(group_member)

    return group_member


@router.get("/groups/invite/{token}/resend", status_code=status.HTTP_204_NO_CONTENT)
async def resend_group_token(token: uuid.UUID, db: Session = Depends(get_db)):
    group_invite = methods.read_by(db, model.GroupInvite, "token", token)
    if_exists(group_invite, "GroupInvite")

    html = get_group_invite_email_html(group_invite.group.name, group_invite.token)

    message = MessageSchema(
        subject="StudyAlign group invite to " + group_invite.group.name,
        recipients=[group_invite.user.email],
        body=html,
        subtype=MessageType.html)

    fm = FastMail(email_config)
    await fm.send_message(message)

    return


@router.delete("/groups/invite/{token}", status_code=status.HTTP_204_NO_CONTENT)
async def remove_group_invite_token(token: uuid.UUID, db: Session = Depends(get_db)):
    group_invite = methods.read_by(db, model.GroupInvite, "token", token)
    if_exists(group_invite, "GroupInvite")

    db.delete(group_invite)
    db.commit()
    return


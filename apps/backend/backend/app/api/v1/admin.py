from datetime import datetime, timedelta

from fastapi import Depends, APIRouter

import methods


import schema.api

router = APIRouter()


@router.post("/admin/access", response_model=schema.api.Tokens)
async def gain_admin_access(admin: schema.api.Admin):
    methods.check_admin_key(admin.api_key)
    return methods.api.issue_tokens(admin.api_key, datetime.utcnow() + timedelta(days=1), role=methods.Role.ADMIN)


@router.get("/admin/refresh", response_model=schema.api.AccessToken)
async def refresh_admin_token(admin: schema.api.Admin = Depends(methods.adminRefreshTokenValidator)):
    return methods.api.issue_access_token(admin.api_key, role=methods.Role.ADMIN)


@router.get("/admin/me/", response_model=schema.api.Admin)
async def admin_me(admin: schema.api.Admin = Depends(methods.adminAccessTokenValidator)):
    return admin

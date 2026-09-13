import uuid
from decouple import config
from fastapi_mail import ConnectionConfig

def get_email_config():
    return ConnectionConfig(
                MAIL_USERNAME=config('MAIL_USERNAME'),
                MAIL_PASSWORD=config('MAIL_PASSWORD'),
                MAIL_FROM=config('MAIL_FROM'),
                MAIL_PORT=config('MAIL_PORT'),
                MAIL_SERVER=config('MAIL_SERVER'),
                MAIL_FROM_NAME=config('MAIL_FROM_NAME'),
                MAIL_STARTTLS=True,
                MAIL_SSL_TLS=False,
                USE_CREDENTIALS=True,
                VALIDATE_CERTS=True
            )

def get_group_invite_email_html(group_name: str, token: uuid.UUID):
    frontend_url = config('FRONTEND_URL')
    accept_url = frontend_url + "/group/invite/" + str(token) + "/accept"
    return f"""<p>You have been invited to join the StudyAlign group "{group_name}".</p>
            <p>Click on this link to accept: <a href="{accept_url}">{accept_url}</a></p>"""

def get_user_activation_mail_html(token: uuid.UUID):
    frontend_url = config('FRONTEND_URL')
    accept_url = frontend_url + "/user/" + str(token) + "/activate"
    return f"""<p>Click on the link below to activate your StudyAlign account: </p>
            <p><a href="{accept_url}">{accept_url}</a></p>"""

def get_password_reset_mail_html(token: str):
    frontend_url = config('FRONTEND_URL')
    reset_url = frontend_url + "/login/reset/" + str(token)
    return f"""<p>You requested to reset your StudyAlign password.</p>
            <p>Click the link below to set a new password (the link is valid for one hour):</p>
            <p><a href="{reset_url}">{reset_url}</a></p>
            <p>If you did not request this, you can safely ignore this email.</p>"""
import uuid
from sqlalchemy.dialects.postgresql import UUID

from model.base import Base
from sqlalchemy import Column, Integer, Enum, ForeignKey, String, DateTime, Boolean
from sqlalchemy.orm import relationship


class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True)
    name = Column(String(20), unique=True)
    email = Column(String(80), unique=True)
    new_email = Column(String(80), unique=True)
    email_activation_token = Column(UUID(as_uuid=True), unique=True, nullable=True)
    password = Column(String)
    firstname = Column(String(60))
    lastname = Column(String(60))
    is_active = Column(Boolean, nullable=False)

    role_id = Column(Integer, ForeignKey('roles.id'))
    role = relationship("Role")

    def __repr__(self):
        return "<User(id='%d', name='%s', role='%s')>" % (self.id, self.name, self.role_id)

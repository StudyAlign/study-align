from model.base import Base
from sqlalchemy import Column, Integer, Enum, ForeignKey, String, DateTime, Boolean
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import uuid


class Role(Base):
    __tablename__ = 'roles'

    id = Column(Integer, primary_key=True)
    name = Column(String(20), unique=True)
    # rights = Column(JSONB, nullable=True)

    def __repr__(self):
        return "<User(id='%d', name='%s', role='%s')>" % (self.id, self.name, self.role)

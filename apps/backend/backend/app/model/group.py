from model.base import Base
from sqlalchemy import Column, Integer, Enum, ForeignKey, String, DateTime, Boolean
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import uuid


class Group(Base):
    __tablename__ = 'groups'

    id = Column(Integer, primary_key=True)
    name = Column(String(60), unique=True)
    slug = Column(String(60), unique=True) # also serves as a reference to the group logo

    owner_id = Column(Integer, ForeignKey('users.id', ondelete='CASCADE'))
    owner = relationship("User")

    group_members = relationship("GroupMember", back_populates="group", cascade="all, delete", passive_deletes=True)
    group_invites = relationship("GroupInvite", back_populates="group", cascade="all, delete", passive_deletes=True)

    def __repr__(self):
        return "<Group(id='%d', name='%s', slug='%s', owner_id='%d')>" % (self.id, self.name, self.role, self.owner_id)

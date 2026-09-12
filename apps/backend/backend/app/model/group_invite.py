from model.base import Base
from sqlalchemy import Column, Integer, Enum, ForeignKey, String, DateTime, Boolean, UniqueConstraint
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import uuid


class GroupInvite(Base):
    __tablename__ = 'group_invites'

    id = Column(Integer, primary_key=True)
    token = Column(UUID(as_uuid=True), unique=True, nullable=False, default=uuid.uuid4)

    group_id = Column(Integer, ForeignKey('groups.id', ondelete="CASCADE"))
    group = relationship("Group")

    user_id = Column(Integer, ForeignKey('users.id', ondelete="CASCADE"))
    user = relationship("User", foreign_keys="GroupInvite.user_id")

    invited_by_id = Column(Integer, ForeignKey('users.id', ondelete="CASCADE"))
    invited_by = relationship("User", foreign_keys="GroupInvite.invited_by_id")

    __table_args__ = (UniqueConstraint('group_id', 'user_id', name='_unique_group_invites_ix'),)

    def __repr__(self):
        return ("<GroupInvite(id='%d', token='%s', group_id='%d', user_id='%d', invited_by='%d')>" %
                (self.id, self.token, self.group_id, self.user_id, self.invited_by_id))
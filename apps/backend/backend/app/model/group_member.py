from model.base import Base
from sqlalchemy import Column, Integer, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship


class GroupMember(Base):
    __tablename__ = 'group_members'

    id = Column(Integer, primary_key=True)

    group_id = Column(Integer, ForeignKey('groups.id', ondelete="CASCADE"))
    group = relationship("Group", back_populates="group_members")

    user_id = Column(Integer, ForeignKey('users.id', ondelete="CASCADE"))
    user = relationship("User")

    __table_args__ = (UniqueConstraint('group_id', 'user_id', name='_unique_group_members_ix'),)

    def __repr__(self):
        return "<GroupMember (id='%d', group_id='%d', user_id='%d')>" % (self.id, self.group_id, self.user_id)

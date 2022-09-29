from model.base import Base
from sqlalchemy import Column, Integer, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship


class Collaborator(Base):
    __tablename__ = 'collaborators'

    id = Column(Integer, primary_key=True)

    study_id = Column(Integer, ForeignKey('studies.id', ondelete="CASCADE"))
    study = relationship("Study", back_populates="collaborators")

    user_id = Column(Integer, ForeignKey('users.id', ondelete="CASCADE"))
    user = relationship("User")

    __table_args__ = (UniqueConstraint('study_id', 'user_id', name='_unique_collaborator_ix'),)

    def __repr__(self):
        return "<Collaborator (id='%d', study_id='%d', user_id='%d')>" % (self.id, self.study_id, self.user_id)

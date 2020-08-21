from model.base import Base
from sqlalchemy import Column, Integer, DateTime, String, ForeignKey
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.dialects.postgresql import UUID
import uuid


class GenericInteraction(Base):
    __tablename__ = 'generic_interactions'

    id = Column(Integer, primary_key=True)
    uuid = Column(UUID(as_uuid=True), unique=True, nullable=False, default=uuid.uuid4)

    time = Column(DateTime(timezone=False))

    study_id = Column(Integer, ForeignKey('studies.id'))
    #study = relationship("Study", back_populates="generic_interactions")

    participant_id = Column(Integer, ForeignKey('participants.id'))
    #participant = relationship("Participant", back_populates="generic_interactions")

    condition_id = Column(Integer, ForeignKey('conditions.id'))
    #condition = relationship("Condition", back_populates="generic_interactions")

    event = Column(String)

    data = Column(JSONB, nullable=False)

    def __repr__(self):
        return "<GenericInteraction(id='%d' data='%s')>" % (self.id, self.data)

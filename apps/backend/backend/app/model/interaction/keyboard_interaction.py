from model.base import Base
from sqlalchemy import Column, String, Integer, Float, Boolean, SmallInteger, DateTime, Enum, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
import uuid


# see: https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent


class KeyboardInteraction(Base):
    __tablename__ = 'keyboard_interactions'

    id = Column(Integer, primary_key=True)
    uuid = Column(UUID(as_uuid=True), unique=True, nullable=False, default=uuid.uuid4)

    time = Column(DateTime(timezone=False))

    study_id = Column(Integer, ForeignKey('studies.id'))
    #study = relationship("Study", back_populates="keyboard_interactions")

    participant_id = Column(Integer, ForeignKey('participants.id'))
    #participant = relationship("Participant", back_populates="keyboard_interactions")

    condition_id = Column(Integer, ForeignKey('conditions.id'))
    #condition = relationship("Condition", back_populates="keyboard_interactions")

    event = Column(Enum("keydown", "keypress", "keyup", name="keyboard_event_enum", create_type=False))

    altKey = Column(Boolean, default=False)
    code = Column(String)
    ctrlKey = Column(Boolean, default=False)
    isComposing = Column(Boolean, default=False)
    key = Column(String)
    locale = Column(String, nullable=True)
    location = Column(SmallInteger)
    metaKey = Column(Boolean, default=False)
    repeat = Column(Boolean, default=False)
    shiftKey = Column(Boolean, default= False)

    def __repr__(self):
        return "<KeyboardInteraction(id='%d')>" % self.id

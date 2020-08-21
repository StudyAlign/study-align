from model.base import Base
from sqlalchemy import Column, String, Integer, Float, Boolean, SmallInteger, DateTime, Enum, ForeignKey
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
import uuid

# see: https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/MouseEvent


class MouseInteraction(Base):
    __tablename__ = 'mouse_interactions'

    id = Column(Integer, primary_key=True)
    uuid = Column(UUID(as_uuid=True), unique=True, nullable=False, default=uuid.uuid4)

    time = Column(DateTime(timezone=False))

    study_id = Column(Integer, ForeignKey('studies.id'))
    #study = relationship("Study", back_populates="mouse_interactions")

    participant_id = Column(Integer, ForeignKey('participants.id'))
    #participant = relationship("Participant", back_populates="mouse_interactions")

    condition_id = Column(Integer, ForeignKey('conditions.id'))
    #condition = relationship("Condition", back_populates="mouse_interactions")

    event = Column(Enum("click", "dblclick", "mouseup", "mousedown", name="mouse_event_enum", create_type=False))

    screenX = Column(Float, default=0)
    screenY = Column(Float, default=0)
    clientX = Column(Float, default=0)
    clientY = Column(Float, default=0)
    ctrlKey = Column(Boolean, default=False)
    shiftKey = Column(Boolean, default=False)
    altKey = Column(Boolean, default=False)
    metaKey = Column(Boolean, default=False)
    button = Column(SmallInteger, default=0)
    buttons = Column(SmallInteger, default=0)
    relatedTarget = Column(Enum("mouseenter", "mouseleave", "mouseout", "mouseover", "dragenter", "dragexit",
                                name="mouse_related_target_enum", create_type=False))
    region = Column(String, nullable=True)

    def __repr__(self):
        return "<MouseInteraction(id='%d')>" % self.id

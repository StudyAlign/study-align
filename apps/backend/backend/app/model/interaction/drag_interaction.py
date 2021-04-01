from model.base import Base
from sqlalchemy import Column, String, Integer, Float, Boolean, SmallInteger, DateTime, Enum, ForeignKey
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.dialects.postgresql import UUID
import uuid

# see: https://developer.mozilla.org/en-US/docs/Web/API/DragEvent
# The Drag Event inherits the properties from Mouse Event


class DragInteraction(Base):
    __tablename__ = 'drag_interactions'

    id = Column(Integer, primary_key=True)
    uuid = Column(UUID(as_uuid=True), unique=True, nullable=False, default=uuid.uuid4)

    time = Column(DateTime(timezone=False))

    study_id = Column(Integer, ForeignKey('studies.id'))
    # study = relationship("Study", back_populates="mouse_interactions")

    participant_id = Column(Integer, ForeignKey('participants.id'))
    # participant = relationship("Participant", back_populates="mouse_interactions")

    condition_id = Column(Integer, ForeignKey('conditions.id'))
    # condition = relationship("Condition", back_populates="mouse_interactions")

    event = Column(Enum("drag", "dragend", "dragenter", "dragexit", "dragleave", "dragover", "dragstart", "drop",
                        name="drag_event_enum", create_type=False))

    altKey = Column(Boolean, default=False)
    button = Column(SmallInteger, default=0)
    buttons = Column(SmallInteger, default=0)
    clientX = Column(Float, default=0)
    clientY = Column(Float, default=0)
    ctrlKey = Column(Boolean, default=False)
    metaKey = Column(Boolean, default=False)
    movementX = Column(Float, default=0)
    movementY = Column(Float, default=0)
    offsetX = Column(Float, default=0)
    offsetY = Column(Float, default=0)
    pageX = Column(Float, default=0)
    pageY = Column(Float, default=0)
    region = Column(String, nullable=True)
    relatedTarget = Column(JSONB, nullable=True)
    screenX = Column(Float, default=0)
    screenY = Column(Float, default=0)
    shiftKey = Column(Boolean, default=False)
    which = Column(SmallInteger, default=0)
    # additional field to store meta data on demand
    metaData = Column(JSONB, nullable=True)

    # x and y are aliases for clientX and clientY

    @property
    def x(self):
        return self.clientX

    @x.setter
    def x(self, x):
        if not self.x:
            self.x = x

    @property
    def y(self):
        return self.clientY

    @y.setter
    def y(self, y):
        if not self.y:
            self.y = y

    def __repr__(self):
        return "<MouseInteraction(id='%d')>" % self.id

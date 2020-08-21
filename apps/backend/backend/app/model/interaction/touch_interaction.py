from model.base import Base
from sqlalchemy import Column, Integer, Float, Boolean, DateTime, Enum, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
import uuid

# see: https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent
from model.interaction.touch_type import TouchType


class TouchInteraction(Base):
    __tablename__ = 'touch_interactions'

    id = Column(Integer, primary_key=True)
    uuid = Column(UUID(as_uuid=True), unique=True, nullable=False, default=uuid.uuid4)

    time = Column(DateTime(timezone=False))

    study_id = Column(Integer, ForeignKey('studies.id'))
    # study = relationship("Study", back_populates="touch_interactions")

    participant_id = Column(Integer, ForeignKey('participants.id'))
    # participant = relationship("Participant", back_populates="touch_interactions")

    condition_id = Column(Integer, ForeignKey('conditions.id'))
    # condition = relationship("Condition", back_populates="touch_interactions")

    event = Column(
        Enum("touchstart", "touchend", "touchmove", "touchcancel", name="touch_event_enum", create_type=False))

    altKey = Column(Boolean, default=False)
    ctrlKey = Column(Boolean, default=False)
    metaKey = Column(Boolean, default=False)
    shiftKey = Column(Boolean, default=False)
    rotation = Column(Float, default=0)  # not standardized, compare with mozilla docs
    scale = Column(Float, default=1)  # not standardized, compare with mozilla docs

    touches = relationship("Touch",
                           secondary=TouchType.__table__,
                           primaryjoin="and_(TouchInteraction.id==TouchType.touch_interaction_id, "
                                       "TouchType.type=='all')",
                           secondaryjoin="Touch.id==TouchType.touch_id")

    changedTouches = relationship("Touch",
                                  secondary=TouchType.__table__,
                                  primaryjoin="and_(TouchInteraction.id==TouchType.touch_interaction_id, "
                                              "TouchType.type=='changed')",
                                  secondaryjoin="Touch.id==TouchType.touch_id")

    targetTouches = relationship("Touch",
                                 secondary=TouchType.__table__,
                                 primaryjoin="and_(TouchInteraction.id==TouchType.touch_interaction_id, "
                                             "TouchType.type=='target')",
                                 secondaryjoin="Touch.id==TouchType.touch_id")

    def __repr__(self):
        return "<TouchInteraction(id='%d')>" % self.id

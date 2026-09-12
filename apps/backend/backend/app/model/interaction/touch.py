from model.base import Base
from sqlalchemy import Column, String, Integer, Float, DateTime, ForeignKey, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.dialects.postgresql import JSONB
import uuid

# see: https://developer.mozilla.org/en-US/docs/Web/API/Touch


class Touch(Base):
    __tablename__ = 'touches'

    id = Column(Integer, primary_key=True)
    uuid = Column(UUID(as_uuid=True), unique=True, nullable=False, default=uuid.uuid4)

    #type = Column(Enum("all", "changed", "target", name="touch_type", create_type=False))

    altitudeAngle = Column(Float) # experimental property, not supported by all browsers
    azimuthAngle = Column(Float) # experimental property, not supported by all browsers
    clientX = Column(Float)
    clientY = Column(Float)
    force = Column(Float)  # experimental property, not supported by all browsers
    identifier = Column(Integer)
    screenX = Column(Float)
    screenY = Column(Float)
    pageX = Column(Float)
    pageY = Column(Float)
    radiusX = Column(Float) # experimental property, not supported by all browsers
    radiusY = Column(Float) # experimental property, not supported by all browsers
    rotationAngle = Column(Float) # experimental property, not supported by all browsers
    target = Column(JSONB, nullable=True)
    touchType = Column(Enum("direct", "stylus", name="touch_type", create_type=False))

    #touch_interaction_id = Column(Integer, ForeignKey('touch_interactions.id'))
    #touch_interaction = relationship("TouchInteraction", back_populates="touches")

    def __repr__(self):
        return "<Touch(id='%d', time='%s')>" % (self.id, self.time)

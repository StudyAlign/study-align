from model.base import Base
from sqlalchemy import Column, String, Integer, Float, DateTime, ForeignKey, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
import uuid

# see: https://developer.mozilla.org/en-US/docs/Web/API/Touch


class Touch(Base):
    __tablename__ = 'touches'

    id = Column(Integer, primary_key=True)
    uuid = Column(UUID(as_uuid=True), unique=True, nullable=False, default=uuid.uuid4)

    #time = Column(DateTime(timezone=False))

    #type = Column(Enum("all", "changed", "target", name="touch_type", create_type=False))

    identifier = Column(Integer)
    screenX = Column(Float)
    screenY = Column(Float)
    clientX = Column(Float)
    clientY = Column(Float)
    pageX = Column(Float)
    pageY = Column(Float)
    target = Column(String)

    #touch_interaction_id = Column(Integer, ForeignKey('touch_interactions.id'))
    #touch_interaction = relationship("TouchInteraction", back_populates="touches")

    def __repr__(self):
        return "<Touch(id='%d', time='%s')>" % (self.id, self.time)

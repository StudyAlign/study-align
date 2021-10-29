from model.base import Base
from sqlalchemy import Column, Integer, String, DateTime, Boolean, ForeignKey
from sqlalchemy.orm import relationship


class Study(Base):
    __tablename__ = 'studies'

    id = Column(Integer, primary_key=True)
    name = Column(String)
    description = Column(String)
    consent = Column(String)
    startDate = Column(DateTime(timezone=False))
    endDate = Column(DateTime(timezone=False))
    isActive = Column(Boolean, nullable=False)

    conditions = relationship("Condition", back_populates="study")
    procedures = relationship("Procedure", back_populates="study")
    participants = relationship("Participant", back_populates="study")
    #interactions = relationship("Interaction", back_populates="study")

    def __repr__(self):
        return "<Study(id='%d', name='%s', startDate='%s', endDate='%s')>" % (self.id, self.name, self.startDate, self.endDate)

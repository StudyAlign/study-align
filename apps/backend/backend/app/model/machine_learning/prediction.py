from model.base import Base
from sqlalchemy import Column, Integer, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import JSONB


class Prediction(Base):
    __tablename__ = 'predictions'

    id = Column(Integer, primary_key=True)
    time = Column(DateTime(timezone=False))
    input = Column(JSONB, nullable=False)
    prediction = Column(JSONB, nullable=False)

    ml_model_id = Column(Integer, ForeignKey('ml_models.id', ondelete="CASCADE"))
    ml_model = relationship("MLModel", back_populates="predictions")

    participant_id = Column(Integer, ForeignKey('participants.id', ondelete="CASCADE"))
    #participant = relationship("Participant", back_populates="predictions")

    condition_id = Column(Integer, ForeignKey('conditions.id', ondelete="CASCADE"))
    condition = relationship("Condition", back_populates="predictions")

    def __repr__(self):
        return "<Interaction(id='%d', time='%s')>" % (self.id, self.time)

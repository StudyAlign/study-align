from model.base import Base
from sqlalchemy import Column, String, Integer, Boolean, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
import uuid


class MLModel(Base):
    __tablename__ = 'ml_models'

    id = Column(Integer, primary_key=True)
    time = Column(DateTime(timezone=False), nullable=False)
    name = Column(String)
    description = Column(String)
    path = Column(String)
    key = Column(UUID(as_uuid=True), unique=False, default=uuid.uuid4)
    active = Column(Boolean, default=False, nullable=False)
    distribute = Column(Boolean, default=False, nullable=False)
    changelog = Column(String, nullable=True)

    old_model_id = Column(Integer(), ForeignKey('ml_models.id'))
    old_model = relationship('MLModel', remote_side=[id])

    condition_id = Column(Integer, ForeignKey('conditions.id'))
    condition = relationship("Condition", back_populates="ml_model")

    predictions = relationship("Prediction", back_populates="ml_model")

    def __repr__(self):
        return "<MLModel(id='%d', name='%s', path='%s')>" % (int(self.id or 0), self.name, self.path)

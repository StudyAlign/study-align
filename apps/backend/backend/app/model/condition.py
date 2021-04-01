from model.base import Base
from sqlalchemy import Column, Integer, String, JSON, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import uuid


class Condition(Base):
    __tablename__ = 'conditions'

    id = Column(Integer, primary_key=True)
    uuid = Column(UUID(as_uuid=True), unique=True, nullable=False, default=uuid.uuid4)
    name = Column(String)
    config = Column(JSON)

    study_id = Column(Integer, ForeignKey('studies.id'))
    study = relationship("Study", back_populates="conditions")

    task_id = Column(Integer, ForeignKey('tasks.id'))
    task = relationship("Task", back_populates="condition")

    ml_model = relationship("MLModel", uselist=False, back_populates="condition")

    # logs
    # interactions = relationship("Interaction", back_populates="condition")
    predictions = relationship("Prediction", back_populates="condition")

    def __repr__(self):
        return "<Condition(id='%d', name='%s', config='%s')>" % (self.id, self.name, self.config)

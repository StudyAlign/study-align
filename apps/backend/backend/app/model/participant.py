from model.base import Base
from sqlalchemy import Column, Integer, Enum, ForeignKey, String, DateTime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import uuid


class Participant(Base):
    __tablename__ = 'participants'

    id = Column(Integer, primary_key=True)
    token = Column(UUID(as_uuid=True), unique=True, nullable=False, default=uuid.uuid4)
    state = Column(Enum("free", "in_progress", "finished", name="state_enum", create_type=False))

    study_start = Column(DateTime(timezone=False))
    study_end = Column(DateTime(timezone=False))
    timezone = Column(String(50))

    logger_key = Column(UUID(as_uuid=True), unique=True, nullable=False, default=uuid.uuid4)

    study_id = Column(Integer, ForeignKey('studies.id'))
    study = relationship("Study", back_populates="participants")

    procedure_id = Column(Integer, ForeignKey('procedures.id'))
    procedure = relationship("Procedure", back_populates="participants")

    # to track progress, e.g. step x of y
    current_procedure_step = Column(Integer, ForeignKey('procedure_steps.id'))
    procedure_step = relationship("ProcedureStep")

    questionnaire_results = relationship("QuestionnaireResult", back_populates="participant")

    # log data

    #interactions = relationship("Interaction", back_populates="participant")
    #predictions = relationship("Prediction", back_populates="participant")

    def __repr__(self):
        return "<Participant(id='%d', token='%s', state='%s')>" % (self.id, self.token, self.state)

from model.base import Base
from sqlalchemy import Column, Integer, ForeignKey
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import relationship


class Procedure(Base):
    __tablename__ = 'procedures'

    id = Column(Integer, primary_key=True)

    study_id = Column(Integer, ForeignKey('studies.id'))
    study = relationship("Study", back_populates="procedures")

    procedure_steps = relationship("ProcedureStep", back_populates="procedure", order_by="asc(ProcedureStep.order)")

    participants = relationship("Participant", back_populates="procedure")

    def __repr__(self):
        return "<Procedure(id='%d' study_id='%d' variant='%d')>" % (self.id, self.study_id, self.variant)

from model.base import Base
from sqlalchemy import Column, Integer, ForeignKey
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import relationship


class Procedure(Base):
    __tablename__ = 'procedures'

    id = Column(Integer, primary_key=True)

    study_id = Column(Integer, ForeignKey('studies.id', ondelete="CASCADE"))
    study = relationship("Study", back_populates="procedures")

    procedure_steps = relationship("ProcedureStep",
                                   back_populates="procedure",
                                   order_by="asc(ProcedureStep.order)",
                                   cascade="all, delete",
                                   passive_deletes=True)

    participants = relationship("Participant",
                                back_populates="procedure",
                                cascade="all, delete",
                                passive_deletes=True)

    def __repr__(self):
        return "<Procedure(id='%d' study_id='%d')>" % (self.id, self.study_id)

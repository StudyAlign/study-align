from model.base import Base
from sqlalchemy import Column, Integer, ForeignKey, Enum, DateTime
from sqlalchemy.orm import relationship


class ProcedureProgress(Base):
    __tablename__ = 'procedure_progress'

    id = Column(Integer, primary_key=True)

    state = Column(Enum("start_experiment", "end_experiment", "start_step", "end_step",
                        name="procedure_progress_enum", create_type=False))

    time = Column(DateTime(timezone=False))

    participant_id = Column(Integer, ForeignKey('participants.id', ondelete="CASCADE"))

    procedure_step_id = Column(Integer, ForeignKey('procedure_steps.id', ondelete="CASCADE"))
    procedure_step = relationship("ProcedureStep")


    def __repr__(self):
        return "<ProcedureProgress(id='%d' state='%s' variant='%s')>" % (self.id, self.state, self.time)

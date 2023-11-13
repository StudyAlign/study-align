from model.base import Base
from sqlalchemy import Column, Integer, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship


class ProcedureStep(Base):
    __tablename__ = 'procedure_steps'

    id = Column(Integer, primary_key=True)

    procedure_id = Column(Integer, ForeignKey('procedures.id', ondelete="CASCADE"))
    procedure = relationship("Procedure", back_populates="procedure_steps")

    condition_id = Column(Integer, ForeignKey('conditions.id', ondelete="CASCADE"))
    condition = relationship("Condition")

    text_id = Column(Integer, ForeignKey('texts.id', ondelete="CASCADE"))
    text = relationship("Text")

    questionnaire_id = Column(Integer, ForeignKey('questionnaires.id', ondelete="CASCADE"))
    questionnaire = relationship("Questionnaire")

    pause_id = Column(Integer, ForeignKey('pauses.id', ondelete="CASCADE"))
    pause = relationship("Pause")

    order = Column(Integer)

    __table_args__ = (UniqueConstraint('condition_id', 'text_id', 'questionnaire_id', 'pause_id', name='_unique_step_ix'),)

    def __repr__(self):
        return "<ProcedureStep (id='%d', order='%d')>" % (self.id if self.id else 0, self.order)

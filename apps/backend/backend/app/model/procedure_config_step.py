from model.base import Base
from sqlalchemy import Column, Integer, ForeignKey, UniqueConstraint, Boolean
from sqlalchemy.orm import relationship


class ProcedureConfigStep(Base):
    __tablename__ = 'procedure_config_steps'

    id = Column(Integer, primary_key=True)

    procedure_config_id = Column(Integer, ForeignKey('procedure_configs.id', ondelete="CASCADE"))
    procedure_config = relationship("ProcedureConfig", foreign_keys=[procedure_config_id], back_populates="procedure_config_steps")

    condition_id = Column(Integer, ForeignKey('conditions.id', ondelete="CASCADE"))
    condition = relationship("Condition")

    text_id = Column(Integer, ForeignKey('texts.id', ondelete="CASCADE"))
    text = relationship("Text")

    questionnaire_id = Column(Integer, ForeignKey('questionnaires.id', ondelete="CASCADE"))
    questionnaire = relationship("Questionnaire")

    pause_id = Column(Integer, ForeignKey('pauses.id', ondelete="CASCADE"))
    pause = relationship("Pause")

    block_id = Column(Integer, ForeignKey('procedure_configs.id', ondelete="CASCADE"))
    block = relationship("ProcedureConfig", foreign_keys=[block_id], back_populates="procedure_config_block_steps")

    order = Column(Integer)
    counterbalance = Column(Boolean, nullable=False)

    __table_args__ = (UniqueConstraint('condition_id', 'text_id', 'questionnaire_id', 'pause_id', 'block_id', name='_unique_config_step_ix'),)

    def __repr__(self):
        return "<ProcedureConfigStep (id='%d', order='%d')>" % (self.id, self.order)

from model.base import Base
from sqlalchemy import Column, Integer, ForeignKey, Boolean, UniqueConstraint
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import relationship


class ProcedureConfig(Base):
    __tablename__ = 'procedure_configs'

    id = Column(Integer, primary_key=True)

    study_id = Column(Integer, ForeignKey('studies.id', ondelete="CASCADE"))
    study = relationship("Study", back_populates="procedure_config")

    main = Column(Boolean, nullable=False, default=False)

    procedure_config_steps = relationship("ProcedureConfigStep",
                                   back_populates="procedure_config",
                                   foreign_keys='ProcedureConfigStep.procedure_config_id',
                                   order_by="asc(ProcedureConfigStep.order)",
                                   cascade="all, delete",
                                   passive_deletes=True)

    procedure_config_block_steps = relationship("ProcedureConfigStep",
                                          back_populates="block",
                                          foreign_keys='ProcedureConfigStep.block_id',
                                          order_by="asc(ProcedureConfigStep.order)",
                                          cascade="all, delete",
                                          passive_deletes=True)

    #__table_args__ = (UniqueConstraint('study_id', 'main', name='_unique_config_ix'),)

    def __repr__(self):
        return "<ProcedureConfig(id='%d' study_id='%d')>" % (self.id, self.study_id)

from sqlalchemy.dialects.postgresql import JSONB

from model.base import Base
from sqlalchemy import Column, Integer, String, DateTime, Boolean, ForeignKey, Enum
from sqlalchemy.orm import relationship


class Study(Base):
    __tablename__ = 'studies'

    id = Column(Integer, primary_key=True)
    name = Column(String)
    description = Column(String)
    consent = Column(String)
    startDate = Column(DateTime(timezone=False))
    endDate = Column(DateTime(timezone=False))
    is_active = Column(Boolean, nullable=False)
    invite_only = Column(Boolean, nullable=False, default=False)

    # SETUP RELATED INFO
    current_setup_step = Column(Enum("information", "study", "procedure", "integrations", "check", "done", name="current_setup_step_enum", create_type=False), nullable=True)
    planned_number_participants = Column(Integer, nullable=False)
    planned_procedure = Column(JSONB, nullable=True)

    procedure_config = relationship("ProcedureConfig", back_populates="study", cascade="all, delete", passive_deletes=True)

    procedures = relationship("Procedure", back_populates="study", cascade="all, delete", passive_deletes=True)
    conditions = relationship("Condition", back_populates="study", cascade="all, delete", passive_deletes=True)
    participants = relationship("Participant", back_populates="study", cascade="all, delete", passive_deletes=True)

    texts = relationship("Text", back_populates="study", cascade="all, delete", passive_deletes=True)

    #interactions = relationship("Interaction", back_populates="study")

    owner_id = Column(Integer, ForeignKey('users.id'))
    owner = relationship("User")

    collaborators = relationship("Collaborator", back_populates="study", cascade="all, delete", passive_deletes=True)

    def __repr__(self):
        return "<Study(id='%d', name='%s', startDate='%s', endDate='%s')>" % (self.id, self.name, self.startDate, self.endDate)

from model.base import Base
from sqlalchemy import Column, Integer, String, ForeignKey, Boolean, DateTime, func, UniqueConstraint
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import relationship


class Form(Base):
    """A native (built-in) questionnaire definition.

    Distinct from the `Questionnaire` model, which only points at an external
    survey (LimeSurvey / Qualtrics). A template has ``is_template = True`` and no
    ``study_id``; a study questionnaire has a ``study_id`` and is created either
    from scratch or by deep-copying a template. The whole structure (pages,
    items, settings) lives in ``definition`` as JSON. ``version`` is bumped on
    edit so stored responses stay interpretable.
    """
    __tablename__ = 'forms'

    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    description = Column(String, nullable=True)
    definition = Column(JSONB, nullable=False, default=dict)

    is_template = Column(Boolean, nullable=False, default=False)
    is_global = Column(Boolean, nullable=False, default=False)
    # Stable identifier for seeded templates (e.g. "sus"), so seeding is idempotent.
    slug = Column(String, nullable=True, unique=True)

    version = Column(Integer, nullable=False, default=1)

    owner_id = Column(Integer, ForeignKey('users.id', ondelete="SET NULL"), nullable=True)
    owner = relationship("User")

    study_id = Column(Integer, ForeignKey('studies.id', ondelete="CASCADE"), nullable=True)
    study = relationship("Study")

    created_at = Column(DateTime(timezone=False), server_default=func.now())
    updated_at = Column(DateTime(timezone=False), server_default=func.now(), onupdate=func.now())

    responses = relationship("FormResponse", back_populates="form", cascade="all, delete", passive_deletes=True)

    def __repr__(self):
        return "<Form(id='%s', name='%s', template=%s)>" % (self.id, self.name, self.is_template)


class FormResponse(Base):
    """One participant's answers to one native questionnaire.

    Upserted as the participant fills the form (autosave); ``submitted`` flips on
    final submit. Answers are keyed by item key (and scale row key).
    """
    __tablename__ = 'form_responses'
    __table_args__ = (UniqueConstraint('form_id', 'participant_id', name='uq_form_participant'),)

    id = Column(Integer, primary_key=True)

    form_id = Column(Integer, ForeignKey('forms.id', ondelete="CASCADE"), nullable=False)
    form = relationship("Form", back_populates="responses")

    participant_id = Column(Integer, ForeignKey('participants.id', ondelete="CASCADE"), nullable=False)
    participant = relationship("Participant")

    study_id = Column(Integer, ForeignKey('studies.id', ondelete="CASCADE"), nullable=True)

    form_version = Column(Integer, nullable=True)
    answers = Column(JSONB, nullable=False, default=dict)
    submitted = Column(Boolean, nullable=False, default=False)

    created_at = Column(DateTime(timezone=False), server_default=func.now())
    updated_at = Column(DateTime(timezone=False), server_default=func.now(), onupdate=func.now())

    def to_csv_row(self):
        return [getattr(self, field.name) for field in self.__table__.c]

    def __repr__(self):
        return "<FormResponse(id='%s', form_id='%s', participant_id='%s')>" % (
            self.id, self.form_id, self.participant_id)

from sqlalchemy.ext.hybrid import hybrid_property

from model.base import Base
from sqlalchemy import Column, Integer, String, ForeignKey, Enum, Boolean, func
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import relationship


class Questionnaire(Base):
    __tablename__ = 'questionnaires'

    id = Column(Integer, primary_key=True)
    system = Column(Enum( "qualtrics", "surveymonkey", "googleforms", "typeform", "jotform", "limesurvey", "native", name="system_enum", create_type=False))
    url = Column(String)

    # For system == "native": the study-scoped Form the participant renders
    # (a copy made on placement, so editing the global source cannot change a
    # placed/running study).
    form_id = Column(Integer, ForeignKey('forms.id', ondelete="SET NULL"), nullable=True)
    form = relationship("Form", foreign_keys=[form_id])

    # The global questionnaire this step was created from (for the picker and to
    # detect when the source selection changes).
    source_form_id = Column(Integer, ForeignKey('forms.id', ondelete="SET NULL"), nullable=True)
    source_form = relationship("Form", foreign_keys=[source_form_id])

    study_id = Column(Integer, ForeignKey('studies.id', ondelete="CASCADE"))
    study = relationship("Study")

    def __repr__(self):
        return "<Questionnaire(id='%d', url='%s')>" % (self.id, self.url)

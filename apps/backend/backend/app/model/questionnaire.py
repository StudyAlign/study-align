from sqlalchemy.ext.hybrid import hybrid_property

from model.base import Base
from sqlalchemy import Column, Integer, String, ForeignKey, Enum, Boolean, func
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import relationship


class Questionnaire(Base):
    __tablename__ = 'questionnaires'

    id = Column(Integer, primary_key=True)
    system = Column(Enum( "qualtrics", "surveymonkey", "googleforms", "typeform", "jotform", "limesurvey", name="system_enum", create_type=False))
    url = Column(String)

    study_id = Column(Integer, ForeignKey('studies.id', ondelete="CASCADE"))
    study = relationship("Study")

    def __repr__(self):
        return "<Questionnaire(id='%d', url='%s')>" % (self.id, self.url)

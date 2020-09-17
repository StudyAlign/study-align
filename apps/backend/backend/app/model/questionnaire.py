from model.base import Base
from sqlalchemy import Column, Integer, String, ForeignKey, Enum
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import relationship


class Questionnaire(Base):
    __tablename__ = 'questionnaires'

    id = Column(Integer, primary_key=True)
    system = Column(Enum("limesurvey", "soscisurvey", name="system", create_type=False))
    url = Column(String)
    results_url = Column(String)
    credentials = Column(JSONB)

    study_id = Column(Integer, ForeignKey('studies.id'))
    study = relationship("Study")

    questionnaire_results = relationship("QuestionnaireResult", back_populates="questionnaire")

    def __repr__(self):
        return "<Questionnaire(id='%d', url='%s')>" % (self.id, self.url)

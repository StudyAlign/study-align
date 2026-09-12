from model.base import Base
from sqlalchemy import Column, Integer, ForeignKey, DateTime
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import relationship


class QuestionnaireResult(Base):
    __tablename__ = 'questionnaire_result'

    id = Column(Integer, primary_key=True)
    time = Column(DateTime(timezone=False))

    result = Column(JSONB)

    participant_id = Column(Integer, ForeignKey('participants.id', ondelete="CASCADE"))
    participant = relationship("Participant", back_populates="questionnaire_results")

    questionnaire_id = Column(Integer, ForeignKey('questionnaires.id', ondelete="CASCADE"))
    questionnaire = relationship("Questionnaire", back_populates="questionnaire_results")

    def __repr__(self):
        return "<Questionnaire Result(id='%d', result='%s')>" % (self.id, self.result)

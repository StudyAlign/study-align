from sqlalchemy.ext.hybrid import hybrid_property

from model.base import Base
from sqlalchemy import Column, Integer, String, ForeignKey, Enum, Boolean
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import relationship


class Questionnaire(Base):
    __tablename__ = 'questionnaires'

    id = Column(Integer, primary_key=True)
    system = Column(Enum("limesurvey", "soscisurvey", "surveymonkey", name="system_enum", create_type=False))
    url = Column(String)

    api_url = Column(String)
    _api_credentials = Column(JSONB)

    ext_id = Column(String)
    participants_populated = Column(Boolean, default=False, nullable=False)

    study_id = Column(Integer, ForeignKey('studies.id'))
    study = relationship("Study")

    questionnaire_results = relationship("QuestionnaireResult", back_populates="questionnaire")

    @property
    def api_credentials(self):
        return self._api_credentials

    @api_credentials.setter
    def api_credentials(self, api_credentials):
        self._api_credentials = api_credentials

    @property
    def api_username(self):
        return self._api_credentials.get("username")

    @api_username.setter
    def api_username(self, api_username):
        if not self._api_credentials:
            self._api_credentials = {}
        self._api_credentials["username"] = api_username

    @property
    def api_password(self):
        return self._api_credentials.get("password")

    @api_password.setter
    def api_password(self, api_password):
        if not self._api_credentials:
            self._api_credentials = {}
        self._api_credentials["password"] = api_password

    def __repr__(self):
        return "<Questionnaire(id='%d', url='%s')>" % (self.id, self.url)

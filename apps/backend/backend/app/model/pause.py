from sqlalchemy.dialects.postgresql import JSON

from model.base import Base
from sqlalchemy import Column, Integer, String, ForeignKey, Enum
from sqlalchemy.orm import relationship


class Pause(Base):
    __tablename__ = 'pauses'

    id = Column(Integer, primary_key=True)
    title = Column(String)
    body = Column(String)
    proceed_body = Column(String)
    type = Column(Enum("time_based", "controlled", name="pause_type_enum", create_type=False))
    config = Column(JSON)

    study_id = Column(Integer, ForeignKey('studies.id', ondelete="CASCADE"))
    study = relationship("Study")

    def __repr__(self):
        return "<Pause(id='%d', title='%s' body='%s')>" % (self.id, self.title, self.body)

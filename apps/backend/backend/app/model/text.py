from model.base import Base
from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship


class Text(Base):
    __tablename__ = 'texts'

    id = Column(Integer, primary_key=True)
    title = Column(String)
    body = Column(String)

    study_id = Column(Integer, ForeignKey('studies.id', ondelete="CASCADE"))
    study = relationship("Study")

    def __repr__(self):
        return "<Text(id='%d', title='%s' body='%s')>" % (self.id, self.title, self.body)

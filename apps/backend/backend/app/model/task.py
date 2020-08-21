from model.base import Base
from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship


class Task(Base):
    __tablename__ = 'tasks'

    id = Column(Integer, primary_key=True)
    name = Column(String)
    description = Column(String)

    condition = relationship("Condition", uselist=False, back_populates="task")

    def __repr__(self):
        return "<Task(id='%d', name='%s', description='%s')>" % (self.id, self.name, self.description)

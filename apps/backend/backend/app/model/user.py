from model.base import Base
from sqlalchemy import Column, Integer, Enum, ForeignKey, String, DateTime, Boolean
from sqlalchemy.orm import relationship


class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True)
    name = Column(String(20), unique=True)
    email = Column(String(80), unique=True, nullable=False)
    password = Column(String)
    firstname = Column(String(60))
    lastname = Column(String(60))
    isActive = Column(Boolean, nullable=False)

    role_id = Column(Integer, ForeignKey('roles.id'))
    role = relationship("Role")

    def __repr__(self):
        return "<User(id='%d', name='%s', role='%s')>" % (self.id, self.name, self.role_id)

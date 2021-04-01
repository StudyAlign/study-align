from model.base import Base
from sqlalchemy import Column, Integer, ForeignKey, Enum

class TouchType(Base):
    __tablename__ = 'touch_types'

    id = Column(Integer, primary_key=True)

    touch_interaction_id = Column(Integer, ForeignKey('touch_interactions.id'))
    touch_id = Column(Integer, ForeignKey('touches.id'))

    type = Column(Enum("all", "changed", "target", name="touch_type_enum", create_type=False))

    def __repr__(self):
        return "<TouchType(id='%d' type='%s')>" % (self.id, self.type)

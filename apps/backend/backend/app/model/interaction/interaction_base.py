from model.base import Base


class InteractionBase(Base):
    __abstract__ = True

    def to_dict(self):
        return {field.name: getattr(self, field.name) for field in self.__table__.c}

    def to_csv_row(self):
        return [getattr(self, field.name) for field in self.__table__.c]
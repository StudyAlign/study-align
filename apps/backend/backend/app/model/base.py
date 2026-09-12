from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

import os

engine = create_engine(os.environ["SQLALCHEMY_DB_URL"], echo=True)
Session = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

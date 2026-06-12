from sqlalchemy import Column, String, Integer, ARRAY
from database import Base

class Word(Base):
    __tablename__ = "words"
    id         = Column(String, primary_key=True)
    somali     = Column(String, nullable=False)
    english    = Column(String, nullable=False)
    category   = Column(String, nullable=False)
    difficulty = Column(Integer, nullable=False)
    audio_url  = Column(String, nullable=True)

class Sentence(Base):
    __tablename__ = "sentences"
    id         = Column(String, primary_key=True)
    somali     = Column(String, nullable=False)
    english    = Column(String, nullable=False)
    category   = Column(String, nullable=False)
    difficulty = Column(Integer, nullable=False)
    word_ids   = Column(ARRAY(String))

class Lesson(Base):
    __tablename__ = "lessons"
    id           = Column(String, primary_key=True)
    title        = Column(String, nullable=False)
    title_somali = Column(String, nullable=False)
    category     = Column(String, nullable=False)
    order        = Column(Integer, nullable=False)
    word_ids     = Column(ARRAY(String))
    sentence_ids = Column(ARRAY(String))

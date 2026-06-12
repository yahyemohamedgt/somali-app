from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional

from database import SessionLocal
from models import Lesson, Word, Sentence

app = FastAPI()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# --- Schemas ---

class WordOut(BaseModel):
    id: str
    somali: str
    english: str
    category: str
    difficulty: int
    audio_url: Optional[str]

    model_config = {"from_attributes": True}


class SentenceOut(BaseModel):
    id: str
    somali: str
    english: str
    category: str
    difficulty: int
    word_ids: list[str]

    model_config = {"from_attributes": True}


class LessonOut(BaseModel):
    id: str
    title: str
    title_somali: str
    category: str
    order: int
    word_ids: list[str]
    sentence_ids: list[str]

    model_config = {"from_attributes": True}


class LessonDetailOut(BaseModel):
    id: str
    title: str
    title_somali: str
    category: str
    order: int
    words: list[WordOut]
    sentences: list[SentenceOut]

    model_config = {"from_attributes": True}


# --- Routes ---

@app.get("/lessons", response_model=list[LessonOut])
def get_lessons(db: Session = Depends(get_db)):
    return db.query(Lesson).order_by(Lesson.order).all()


@app.get("/lessons/{lesson_id}", response_model=LessonDetailOut)
def get_lesson(lesson_id: str, db: Session = Depends(get_db)):
    lesson = db.query(Lesson).filter(Lesson.id == lesson_id).first()
    if not lesson:
        raise HTTPException(status_code=404, detail="Lesson not found")

    words = db.query(Word).filter(Word.id.in_(lesson.word_ids or [])).all()
    sentences = db.query(Sentence).filter(Sentence.id.in_(lesson.sentence_ids or [])).all()

    return LessonDetailOut(
        id=lesson.id,
        title=lesson.title,
        title_somali=lesson.title_somali,
        category=lesson.category,
        order=lesson.order,
        words=words,
        sentences=sentences,
    )


@app.get("/words", response_model=list[WordOut])
def get_words(db: Session = Depends(get_db)):
    return db.query(Word).all()


@app.get("/words/{category}", response_model=list[WordOut])
def get_words_by_category(category: str, db: Session = Depends(get_db)):
    words = db.query(Word).filter(Word.category == category).all()
    if not words:
        raise HTTPException(status_code=404, detail=f"No words found for category '{category}'")
    return words

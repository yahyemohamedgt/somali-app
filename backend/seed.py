import json
from database import SessionLocal, engine, Base
from models import Word, Sentence, Lesson

def seed():
    Base.metadata.create_all(engine)

    with open("somali_seed_data.json") as f:
        data = json.load(f)

    db = SessionLocal()

    db.query(Lesson).delete()
    db.query(Sentence).delete()
    db.query(Word).delete()

    for w in data["words"]:
        db.add(Word(**w))

    for s in data["sentences"]:
        db.add(Sentence(**s))

    for l in data["lessons"]:
        db.add(Lesson(**l))

    db.commit()
    db.close()
    print(f"Seeded {len(data['words'])} words, {len(data['sentences'])} sentences, {len(data['lessons'])} lessons")

if __name__ == "__main__":
    seed()
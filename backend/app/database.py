from sqlmodel import SQLModel, create_engine, Session
from app.core.config import settings

# In production, we'll use pooling and connection lifecycle handling.
engine = create_engine(settings.DATABASE_URL, echo=True)

def init_db():
    # This will create all tables defined with SQLModel
    SQLModel.metadata.create_all(engine)

def get_session():
    with Session(engine) as session:
        yield session

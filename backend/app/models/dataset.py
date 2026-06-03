from typing import Optional
from sqlmodel import SQLModel, Field
from datetime import datetime

class DatasetBase(SQLModel):
    user_id: int = Field(foreign_key="user.id", index=True)
    filename: str
    file_url: str
    size_bytes: int
    row_count: Optional[int] = None
    column_count: Optional[int] = None

class Dataset(DatasetBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    uploaded_at: datetime = Field(default_factory=datetime.utcnow)

class DatasetCreate(DatasetBase):
    pass

class DatasetRead(DatasetBase):
    id: int
    uploaded_at: datetime

from sqlalchemy import (
    Column,
    Integer,
    String,
    Text,
    DateTime
)

from datetime import datetime

from .db import Base


class Interview(Base):

    __tablename__ = "interviews"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    session_id = Column(
        String,
        unique=True
    )

    role = Column(String(255))

    skills = Column(Text)

    projects = Column(Text)

    experience = Column(Text)

    total_score = Column(String(50))

    evaluation = Column(Text)

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )
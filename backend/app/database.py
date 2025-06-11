from sqlalchemy import create_engine, MetaData
from sqlalchemy.orm import sessionmaker, declarative_base
import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

# ⛽ SQLAlchemy Engine
engine = create_engine(DATABASE_URL)

# 🔁 Session Local
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# 🧱 Base class for ORM models
Base = declarative_base()

# 📦 shared metadata (used in Table-based schema)
metadata = Base.metadata

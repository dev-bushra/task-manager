from sqlalchemy import create_engine, MetaData
from sqlalchemy.orm import sessionmaker, declarative_base
from databases import Database
import os

# 🔐 رابط الاتصال من Supabase (انسخه من Supabase مباشرة)
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql+asyncpg://USER:PASSWORD@HOST:PORT/DATABASE")

# قاعدة البيانات باستخدام مكتبة databases (للاستخدام مع async)
database = Database(DATABASE_URL)

# SQLAlchemy engine
engine = create_engine(DATABASE_URL.replace("asyncpg", "psycopg2"), echo=True)
metadata = MetaData()
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class لإنشاء الجداول
Base = declarative_base()

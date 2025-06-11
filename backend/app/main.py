from fastapi import FastAPI
from .database import engine, metadata
from .routers import tasks

# 🔨 Create all tables at startup
metadata.create_all(bind=engine)

app = FastAPI()

# ✅ API Routers
app.include_router(tasks.router, prefix="/tasks", tags=["Tasks"])

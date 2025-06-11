# app/main.py
from fastapi import FastAPI
from .database import database, engine, metadata
from .routers import tasks
from .models import tasks as tasks_table

# Create all tables
metadata.create_all(bind=engine)

app = FastAPI()

@app.on_event("startup")
async def startup():
    await database.connect()

@app.on_event("shutdown")
async def shutdown():
    await database.disconnect()

app.include_router(tasks.router, prefix="/tasks", tags=["Tasks"])

from .database import database
from .models import tasks
from .schemas import TaskCreate, TaskUpdate

async def get_all_tasks():
    query = tasks.select()
    return await database.fetch_all(query)

async def get_task(task_id: int):
    query = tasks.select().where(tasks.c.id == task_id)
    return await database.fetch_one(query)

async def create_task(task: TaskCreate):
    query = tasks.insert().values(**task.dict())
    task_id = await database.execute(query)
    return {**task.dict(), "id": task_id}

async def update_task(task_id: int, task: TaskUpdate):
    query = tasks.update().where(tasks.c.id == task_id).values(**task.dict())
    await database.execute(query)
    return {**task.dict(), "id": task_id}

async def delete_task(task_id: int):
    query = tasks.delete().where(tasks.c.id == task_id)
    return await database.execute(query)

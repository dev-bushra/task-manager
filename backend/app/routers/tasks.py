# app/routers/tasks.py
from fastapi import APIRouter, HTTPException
from typing import List
from .. import crud, schemas

router = APIRouter()

@router.get("/", response_model=List[schemas.TaskInDB])
async def read_tasks():
    return await crud.get_all_tasks()

@router.get("/{task_id}", response_model=schemas.TaskInDB)
async def read_task(task_id: int):
    task = await crud.get_task(task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task

@router.post("/", response_model=schemas.TaskInDB)
async def create(task: schemas.TaskCreate):
    return await crud.create_task(task)

@router.put("/{task_id}", response_model=schemas.TaskInDB)
async def update(task_id: int, task: schemas.TaskUpdate):
    db_task = await crud.get_task(task_id)
    if not db_task:
        raise HTTPException(status_code=404, detail="Task not found")
    return await crud.update_task(task_id, task)

@router.delete("/{task_id}")
async def delete(task_id: int):
    db_task = await crud.get_task(task_id)
    if not db_task:
        raise HTTPException(status_code=404, detail="Task not found")
    await crud.delete_task(task_id)
    return {"message": "Task deleted successfully"}

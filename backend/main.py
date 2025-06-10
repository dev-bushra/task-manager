# this line means we are importing FastAPI and HTTPException from fastapi, which are used to create the API and handle HTTP exceptions
from fastapi import FastAPI, HTTPException

# this line mean we are importing BaseModel from pydantic, which is a library for data validation and settings management
from pydantic import BaseModel

# this line mean we are importing Optional and List from typing, which are used for type hinting in Python
from typing import Optional, List

# this line initializes the FastAPI application instance
app = FastAPI()


# Task class inherits from BaseModel, which allows us to define the structure of a task
# Each task has an ID, title, description (optional), and a completed status (default is False)
# This class will be used to validate the data sent to the API and the data returned by the API
# BaseModel is a class from Pydantic that allows us to define data models with validation
class TaskBase(BaseModel):
    title: str
    description: Optional[str] = None
    completed: bool = False


# Task class inherits from TaskBase, which means it has the same fields as TaskBase but also includes an ID field and is used for returning tasks
class Task(TaskBase):
    id: int


# tasks variable In-memory list to store tasks temporarily (without a database)
tasks: List[Task] = [
    Task(
        id=0,
        title="Sample Task 0",
        description="This is a sample task",
        completed=False,
    ),
    Task(
        id=1,
        title="Sample Task 1",
        description="This is a sample task",
        completed=False,
    ),
    Task(
        id=2,
        title="Sample Task 2",
        description="This is another sample task",
        completed=True,
    ),
]
# Auto-increment counter, it is used to keep track of the next task ID to be assigned
task_id_counter = 3


# Create a new task
@app.post("/tasks/", response_model=Task)
def create_task(task: Task):
    global task_id_counter
    task.id = task_id_counter
    task_id_counter += 1
    tasks.append(task)
    return task


# Get all tasks
@app.get("/tasks/", response_model=List[Task])
def get_tasks():
    return tasks


# Get a task by ID
@app.get("/tasks/{task_id}", response_model=Task)
def get_task(task_id: int):
    task = next((t for t in tasks if t.id == task_id), None)
    if task is None:
        raise HTTPException(status_code=404, detail="Task not found")
    return task


# Update a task by ID
@app.put("/tasks/{task_id}", response_model=Task)
def update_task(task_id: int, updated_task: Task):
    task = next((t for t in tasks if t.id == task_id), None)
    if task is None:
        raise HTTPException(status_code=404, detail="Task not found")
    task.title = updated_task.title
    task.description = updated_task.description
    task.completed = updated_task.completed
    return task


# Delete a task by ID
@app.delete("/tasks/{task_id}", response_model=Task)
def delete_task(task_id: int):
    task = next((t for t in tasks if t.id == task_id), None)
    if task is None:
        raise HTTPException(status_code=404, detail="Task not found")
    tasks.remove(task)
    return task


# Root endpoint
@app.get("/")
def read_root():
    return {"message": "Welcome to the Task API"}


# Documentation:
# Run the application using: uvicorn main:app --reload
# This is a simple FastAPI application that provides a RESTful API for managing tasks.
# Note: The above code is a simple in-memory task management API using FastAPI.
# It allows you to create, read, update, and delete tasks.
# The tasks are stored in a list and will not persist after the application is stopped.
# This is a basic example and does not include features like authentication, database integration, or advanced error handling.
# This code is meant for educational purposes and can be extended with more features as needed.
# The API can be tested using tools like Postman or cURL, or by using the interactive Swagger UI provided by FastAPI at /docs.
# The API is designed to be simple and easy to understand, making it a good starting point for learning FastAPI.
# The code is structured to follow best practices for FastAPI applications, including using Pydantic models for data validation and type hinting.
# The API endpoints are designed to be RESTful, following standard HTTP methods for CRUD operations.
# The code is modular and can be easily extended with additional features or functionality as needed.
# The API is designed to be simple and easy to understand, making it a good starting point for learning FastAPI.
# The code is structured to follow best practices for FastAPI applications, including using Pydantic models for data validation and type hinting.
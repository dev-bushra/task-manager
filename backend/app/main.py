from fastapi import FastAPI
from .database import engine, metadata
from .routers import tasks
from fastapi.middleware.cors import CORSMiddleware

# 🔨 Create all tables at startup
metadata.create_all(bind=engine)

app = FastAPI()

#  👇 أضف الكود دا مباشرة بعد إنشاء app
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4200"],  # هنا تحط عنوان الـ frontend بتاعك
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ API Routers
app.include_router(tasks.router, prefix="/tasks", tags=["Tasks"])

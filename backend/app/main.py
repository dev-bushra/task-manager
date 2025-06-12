from fastapi import FastAPI
from .database import engine, metadata
from .routers import tasks
from fastapi.middleware.cors import CORSMiddleware
import os

SUPABASE_URL = os.getenv("NEXT_PUBLIC_SUPABASE_URL")
SUPABASE_KEY = os.getenv("NEXT_PUBLIC_SUPABASE_ANON_KEY")
print("NEXT_PUBLIC_SUPABASE_URL =", SUPABASE_URL)
print("NEXT_PUBLIC_SUPABASE_ANON_KEY =", SUPABASE_KEY)


# 🔨 Create all tables at startup
metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # أو ضع نطاق Vercel فقط لتحكم أفضل
    # allow_origins=["https://task-manager-fastapi.vercel.app"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ API Routers
app.include_router(tasks.router, prefix="/tasks", tags=["Tasks"])




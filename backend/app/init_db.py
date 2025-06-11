from .database import Base, engine
from .models import Task

print("Creating tables in DB...")
Base.metadata.create_all(bind=engine)
print("✅ Done.")

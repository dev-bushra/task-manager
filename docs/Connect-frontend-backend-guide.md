// ✅ FastAPI side needs these endpoints:
// GET /tasks — list tasks
// POST /tasks — create task
// PUT /tasks/{id}/toggle — toggle completion
// DELETE /tasks/{id} — delete task

// ✔️ Now your Angular frontend is fully connected to the FastAPI backend 🎉
// Use: ng serve  — to run frontend
// Use: uvicorn app.main:app --reload  — to run backend

📄 Connect-frontend-backend-guide.ts

✳️ شنو التعديلات العملناها؟
✅ أول حاجة:
أضفنا رابط الـ API بتاع الباك اند في:
src/environments/environment.ts

ts
Copy code
export const environment = {
  production: false,
  apiUrl: 'http://127.0.0.1:8000'
};
✅ بعدين:
عدّلنا task.service.ts بالكامل عشان يستخدم HTTP بدال localStorage.

✅ وبعدين:
عدّلنا task-list.component.ts عشان يستخدم الـ TaskService الجديد ويشتغل مع الـ API.


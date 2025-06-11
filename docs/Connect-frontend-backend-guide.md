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

###
ما الجديد الذي أضفناه؟
1. التخزين المحلي LocalStorage
saveToLocalStorage() و loadFromLocalStorage() لحفظ واسترجاع المهام.

يتم استخدام هذه الدوال دائمًا مع كل تغيير في المهام حتى بدون اتصال.

2. قائمة انتظار المزامنة (Sync Queue)
يتم تخزين كل عملية (add/toggle/delete) في قائمة انتظار محلية إذا كان الجهاز غير متصل.

عند استعادة الاتصال، يتم تنفيذ كل العمليات المتأخرة بالتسلسل عبر syncWithServer().

3. مراقبة حالة الاتصال
نستخدم fromEvent(window, 'online') و offline لمتابعة تغيّر الاتصال وتفعيل المزامنة التلقائية عند عودة الإنترنت.

🧠 لماذا استخدمنا Date.now() كـ id مؤقت؟
لأن الخادم لم يرد بعد بالمعرّف الحقيقي، فنستخدم معرّف مؤقت لضمان عرض المهمة مباشرة، ثم بعد المزامنة يتم تحميل المهام من الخادم لتحديث البيانات.

💡 ملاحظات مهمة:
Task.id يجب أن يكون number وليس string (راجع الخطأ السابق).

كل عملية تحدث مباشرة على الواجهة ثم تتم مزامنتها — وهذا يوفّر تجربة استخدام سلسة.

✅ خطوات لاحقة (اختيارية):
يمكنك عرض رسالة “جاري المزامنة...” عندما تكون هناك عناصر في قائمة الانتظار.

دعم Conflict Resolution (إذا قام المستخدم بتعديل نفس المهمة من جهاز آخر قبل المزامنة).

استخدام IndexedDB بدلاً من LocalStorage لو كانت المهام كبيرة أو تحتاج تشفير.

هل تريد أن نطبّق الآن نفس النظام في مكون الواجهة task-list.component.ts لعرض حالة الاتصال أو قائمة انتظار؟
###
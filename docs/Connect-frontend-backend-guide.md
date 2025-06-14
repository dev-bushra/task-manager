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

<!-- Conflict Resolution and indexDB -->
🧠 شرح خارجي (بالعربية)
✅ كيف يعمل syncing$
يتم تحديثها إلى true عند وجود عمليات في قائمة الانتظار.

يتم إرجاعها إلى false بعد نجاح المزامنة أو الانتهاء منها بأي حالة.

✅ حل التعارضات
لو كان هناك تعديل محلي أثناء فصل الإنترنت، نضيفه إلى syncQueue.

بعد عودة الاتصال:

نرسل العناصر واحدة تلو الأخرى (add/toggle/delete).

ثم نستخدم loadFromServer() لجلب آخر نسخة حديثة من السيرفر (تفادي التعارضات).

✅ ما تبقى
تم الآن:

✅ استخدام LocalStorage بشكل متكامل.

✅ قائمة انتظار للمزامنة عند عودة الاتصال.

✅ إشعار للمستخدم عند وجود مزامنة.

✅ جلب النسخة النهائية من السيرفر لحل أي تعارضات.

#######

📦 مشروعك: FastAPI داخل مجلد backend
✅ ملف render.yaml جاهز:
📝 أنشئ هذا الملف في جذر المشروع (يعني في نفس مكان مجلد backend) باسم:

render.yaml

yaml
Copy
Edit
services:
  - type: web
    name: task-manager-backend
    env: python
    region: oregon  # أو غيرها حسب أقرب منطقة ليك
    branch: main
    rootDir: backend
    buildCommand: pip install -r requirements.txt
    startCommand: uvicorn app.main:app --host 0.0.0.0 --port 10000
    envVars:
      - key: DATABASE_URL
        value: <ضع رابط PostgreSQL من Supabase>
      - key: OTHER_ENV_VAR
        value: <قيمة أخرى لو عندك .env>
📌 شرح سريع:
السطر	المعنى
type: web	خدمة ويب (تسمع على HTTP)
rootDir: backend	مجلد المشروع الحقيقي اللي فيه requirements.txt و main.py
buildCommand	يأمر Render يثبت المتطلبات
startCommand	يأمره يشغل uvicorn على main.py
envVars	هنا تضع كل متغيرات البيئة المهمة زي DATABASE_URL

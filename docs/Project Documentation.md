Project Overview
This project is a FastAPI backend connected to a PostgreSQL database hosted on Supabase. It is designed with clean architecture, modular code, and best practices to ensure maintainability and scalability.

How We Built the Project:
Started with setting up FastAPI as the backend framework.

Configured PostgreSQL database connection with Supabase.

Implemented database models using SQLAlchemy.

Created async CRUD endpoints for core functionalities.

Added environment variables for sensitive data.

Included database migration/init script for easy setup.

Added detailed logging and error handling.

Tested connection and APIs locally and deployed.

Steps to Build
Setup virtual environment and install dependencies from requirements text file.

Configure .env file with your Supabase DB connection string and credentials.

Initialize and migrate the database using provided scripts.

Run the FastAPI application using Uvicorn.

Test endpoints locally or integrate with frontend.

Database Connection
Use the Supabase PostgreSQL connection URI:

bash
Copy code
postgresql://postgres:[YOUR-PASSWORD]@db.yxmqkppyxzerltffexom.supabase.co:5432/postgres
Replace [YOUR-PASSWORD] with your Supabase database password.

Store this URI securely in your .env file as DATABASE_URL.

Database Migration / Initialization
To create or reset database schema and tables, run:

bash
Copy code
python -m app.init_db
This script will connect to the DB, create necessary tables, and prepare the schema for the application.

Database Details
PostgreSQL hosted on Supabase.

Tables created via SQLAlchemy models.

Supports async DB operations.

Connection pooling handled by FastAPI configuration.

Supabase project dashboard for monitoring and managing DB.

Full Command Line Guide
bash
Copy code
# 1. Create and activate virtual environment
python -m venv venv
source venv/bin/activate       # Linux/Mac
venv\Scripts\activate          # Windows

# 2. Install dependencies
<!-- pip install -r requirements -->

# 3. Configure environment variables
# Create .env file with:
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.yxmqkppyxzerltffexom.supabase.co:5432/postgres"

# 4. Initialize/migrate database
python -m app.init_db

# 5. Run the FastAPI server
uvicorn app.main:app --reload

# 6. (Optional) Test DB connectivity (ping is disabled on Supabase, so test via app or DB client)
# Use pgAdmin, DBeaver, or directly connect with psql client

Project Structure Guide
graphql
Copy code
app/
├── main.py           # FastAPI app entry point
├── init_db.py        # DB initialization/migration script
├── models.py         # SQLAlchemy models
├── crud.py           # Database CRUD operations
├── api/              # API routes modules
├── core/             # Config, settings, utilities
└── tests/            # Unit and integration tests
Summary for Developers
Use DATABASE_URL env variable for DB connection.

Always run python -m app.init_db after DB changes.

Run FastAPI with uvicorn app.main:app --reload.

Use standard Python venv workflow.

Test connectivity with DB client tools since ping is blocked.

Project designed for async, scalable backend APIs with PostgreSQL on Supabase.

#####
Arabic Version
نظرة عامة على المشروع
هذا المشروع هو Backend مبني بـ FastAPI متصل بقاعدة بيانات PostgreSQL مستضافة على Supabase. المشروع مبني بهيكلية نظيفة، برمجة منظمة، وممارسات احترافية لضمان سهولة الصيانة والتطوير.

كيف بنينا المشروع
بدأنا بإعداد FastAPI كإطار العمل الأساسي.

ربطنا قاعدة بيانات PostgreSQL عبر Supabase.

صممنا نماذج قاعدة البيانات باستخدام SQLAlchemy.

أنشأنا واجهات برمجة التطبيقات CRUD بشكل غير متزامن.

أضفنا متغيرات بيئة لحماية البيانات الحساسة.

شملنا سكريبت تهيئة وهجرة قاعدة البيانات.

أضفنا سجلات تفصيلية وتعامل مع الأخطاء.

اختبرنا الاتصال والواجهات محليًا ومن ثم نشرناه.

خطوات بناء المشروع
إنشاء بيئة افتراضية وتنصيب الحزم.

إعداد ملف .env ببيانات الاتصال بقاعدة البيانات.

تهيئة قاعدة البيانات باستخدام السكريبت.

تشغيل تطبيق FastAPI عبر Uvicorn.

اختبار الواجهات محليًا أو ربطها مع الواجهة الأمامية.

الاتصال بقاعدة البيانات
استخدم URI اتصال Supabase:

bash
Copy code
postgresql://postgres:[YOUR-PASSWORD]@db.yxmqkppyxzerltffexom.supabase.co:5432/postgres
استبدل [YOUR-PASSWORD] بكلمة مرور قاعدة البيانات.

خزّن الرابط في ملف .env كـ DATABASE_URL.

الهجرة وتهيئة قاعدة البيانات
لتنفيذ تهيئة أو تحديث جداول قاعدة البيانات، شغّل الأمر:

bash
Copy code
python -m app.init_db
السكريبت يقوم بإنشاء الجداول اللازمة وتجهيز قاعدة البيانات.

تفاصيل قاعدة البيانات
PostgreSQL مستضافة على Supabase.

الجداول مصممة عبر SQLAlchemy.

يدعم العمليات غير المتزامنة.

إعدادات إدارة الاتصالات مهيأة عبر FastAPI.

يمكن مراقبة وإدارة قاعدة البيانات عبر لوحة Supabase.

دليل أوامر الاستخدام الكامل
bash
Copy code
# 1. إنشاء وتفعيل البيئة الافتراضية
python -m venv venv
source venv/bin/activate       # لينكس / ماك
venv\Scripts\activate          # ويندوز

# 2. تنصيب الحزم
<!-- pip install -r requirements -->

# 3. إعداد متغيرات البيئة
# أنشئ ملف .env يحتوي:
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.yxmqkppyxzerltffexom.supabase.co:5432/postgres"

# 4. تهيئة / هجرة قاعدة البيانات
python -m app.init_db

# 5. تشغيل خادم FastAPI
uvicorn app.main:app --reload

# 6. (اختياري) اختبار اتصال قاعدة البيانات (ping غير مدعوم في Supabase)
# استخدم أدوات مثل pgAdmin أو DBeaver أو psql للاتصال مباشرة
دليل هيكلية المشروع
bash
Copy code
app/
├── main.py           # نقطة الدخول لتطبيق FastAPI
├── init_db.py        # سكريبت تهيئة وهجرة قاعدة البيانات
├── models.py         # نماذج SQLAlchemy
├── crud.py           # عمليات CRUD على قاعدة البيانات
├── api/              # وحدات ومسارات API
├── core/             # إعدادات، تكوينات، وأدوات مساعدة
└── tests/            # اختبارات الوحدة والتكامل
ملخص للمطورين
استخدم متغير البيئة DATABASE_URL للاتصال بقاعدة البيانات.

بعد أي تغييرات في قاعدة البيانات، شغّل دائمًا python -m app.init_db.

لتشغيل السيرفر استخدم uvicorn app.main:app --reload.

اتبع دورة حياة البيئات الافتراضية في بايثون.

اختبار الاتصال مع قاعدة البيانات عبر أدوات DB client لأن ping محجوب.

المشروع مبني لخوادم API غير متزامنة وقابلة للتوسع مع PostgreSQL عبر Supabase.


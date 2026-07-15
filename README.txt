Machawi Dajaj ERP PWA — النسخة المصححة

احذف أو استبدل الملفات القديمة في GitHub ثم ارفع هذه الملفات الخمسة:
1. index.html
2. manifest.json
3. service-worker.js
4. icon-192.png
5. icon-512.png

بعد نشر Vercel:
- افتح الموقع في Chrome.
- امسح بيانات الموقع/الكاش إن بقيت النسخة القديمة.
- اختر تثبيت التطبيق من قائمة Chrome.

سبب الإصلاح:
كود PWA السابق دخل داخل نص طباعة في index.html، فظهر كود JavaScript في الصفحة.

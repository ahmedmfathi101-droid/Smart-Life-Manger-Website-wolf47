"use strict";

const DB_KEY = "life_os_dashboard_db_v2";
const LEGACY_DB_KEY = "life_os_dashboard_db_v1";
const SESSION_KEY = "life_os_dashboard_session_v1";
const SYSTEM_USER_COUNT = 11000;
const FIREBASE_SDK_VERSION = "12.7.0";

const todayISO = () => new Date().toISOString().slice(0, 10);
const nowISO = () => new Date().toISOString();
const id = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;

const navItems = [
  { id: "home", label: "الرئيسية", icon: "⌂" },
  { id: "health", label: "الصحة والجسم", icon: "♡" },
  { id: "learning", label: "العقل والتعلم", icon: "♙" },
  { id: "finance", label: "المال والعمل", icon: "▣" },
  { id: "relationships", label: "العلاقات والمشاعر", icon: "♧" },
  { id: "meaning", label: "المعنى والروح", icon: "✦" },
  { id: "priorities", label: "الأولويات", icon: "⚐" },
  { id: "reports", label: "التخطيط", icon: "▥" },
  { id: "settings", label: "الإعدادات", icon: "⚙" }
];

const domains = {
  health: {
    label: "الصحة والجسم",
    short: "صحة",
    icon: sectionIcon("health"),
    scoreLabel: "Health Score",
    color: "#28a765",
    soft: "#e7f8ee",
    tint: "#f4fff8",
    line: "#bfe9cf"
  },
  learning: {
    label: "العقل والتعلم",
    short: "تعلم",
    icon: sectionIcon("learning"),
    scoreLabel: "Learning Score",
    color: "#2b9be8",
    soft: "#e6f4ff",
    tint: "#f5fbff",
    line: "#b9def8"
  },
  finance: {
    label: "المال والعمل",
    short: "مال",
    icon: sectionIcon("finance"),
    scoreLabel: "Finance Score",
    color: "#5b42c5",
    soft: "#eeeafe",
    tint: "#faf8ff",
    line: "#d1c7f7"
  },
  relationships: {
    label: "العلاقات والمشاعر",
    short: "علاقات",
    icon: sectionIcon("relationships"),
    scoreLabel: "Relationship Score",
    color: "#d73759",
    soft: "#fff0f3",
    tint: "#fff8fa",
    line: "#ffc4d0"
  },
  meaning: {
    label: "المعنى والروح",
    short: "معنى",
    icon: sectionIcon("meaning"),
    scoreLabel: "Spiritual Score",
    color: "#ea8a00",
    soft: "#fff4df",
    tint: "#fffaf0",
    line: "#ffd89a"
  }
};

function sectionIcon(type) {
  const icons = {
    health: `<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M24 40s-15-8.8-15-20.2C9 14.1 12.9 10 18.1 10c3 0 4.9 1.3 5.9 3.1C25 11.3 26.9 10 29.9 10 35.1 10 39 14.1 39 19.8 39 31.2 24 40 24 40Z" fill="none" stroke="currentColor" stroke-width="3" stroke-linejoin="round"/><path d="M13 25h7l3-7 4 13 3-6h5" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    learning: `<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M15 33c-5-2-8-6-8-11 0-7 6-12 14-12h6c8 0 14 5 14 12 0 5-3 9-8 11" fill="none" stroke="currentColor" stroke-width="3"/><path d="M18 18v19M30 18v19M18 27h12" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"/><path d="M12 37h24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"/></svg>`,
    finance: `<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M10 18h28a4 4 0 0 1 4 4v14a4 4 0 0 1-4 4H10a4 4 0 0 1-4-4V14a4 4 0 0 1 4-4h22" fill="none" stroke="currentColor" stroke-width="3" stroke-linejoin="round"/><path d="M33 29h9M16 24h12M16 31h7" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"/><path d="M33 10v10l7-5-7-5Z" fill="currentColor"/></svg>`,
    relationships: `<svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="17" cy="17" r="6" fill="none" stroke="currentColor" stroke-width="3"/><circle cx="32" cy="19" r="5" fill="none" stroke="currentColor" stroke-width="3"/><path d="M6 39c1.8-8 6-12 12-12s10 4 12 12M26 38c1-6 4.6-9 9-9 3.3 0 5.8 1.7 7 5" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"/></svg>`,
    meaning: `<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M24 5l5.5 12.5L43 23l-13.5 5.5L24 43l-5.5-14.5L5 23l13.5-5.5L24 5Z" fill="none" stroke="currentColor" stroke-width="3" stroke-linejoin="round"/><path d="M24 17v12M18 23h12" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"/></svg>`
  };
  return icons[type] || "◆";
}

const moduleGroups = {
  health: [
    {
      id: "gym",
      label: "الجيم والتمارين",
      desc: "جدول الجيم، المقاومة، الكارديو، العضلات المستهدفة",
      fields: [
        { id: "workout", label: "نوع التمرين", type: "text", placeholder: "Push / Pull / Legs" },
        { id: "targetMuscles", label: "العضلات المستهدفة", type: "text", placeholder: "صدر، ظهر، رجل" },
        { id: "resistanceMinutes", label: "دقائق المقاومة", type: "number", unit: "دقيقة" },
        { id: "cardioMinutes", label: "دقائق الكارديو", type: "number", unit: "دقيقة" },
        { id: "intensity", label: "الشدة", type: "select", options: ["خفيف", "متوسط", "عالي"] },
        { id: "notes", label: "ملاحظات", type: "textarea", full: true }
      ]
    },
    {
      id: "movement",
      label: "الرياضة والحركة",
      desc: "المشي، الخطوات، الجري، السباحة، ركوب العجلة",
      fields: [
        { id: "steps", label: "عدد الخطوات", type: "number" },
        { id: "walkingMinutes", label: "المشي", type: "number", unit: "دقيقة" },
        { id: "runningMinutes", label: "الجري", type: "number", unit: "دقيقة" },
        { id: "swimmingMinutes", label: "السباحة", type: "number", unit: "دقيقة" },
        { id: "cyclingMinutes", label: "ركوب العجلة", type: "number", unit: "دقيقة" }
      ]
    },
    {
      id: "nutrition",
      label: "الأكل والتغذية",
      desc: "الوجبات، السعرات، البروتين، الكارب، الدهون، الفايبر",
      fields: [
        { id: "meal", label: "الوجبة", type: "text", placeholder: "فطار / غداء / عشاء" },
        { id: "calories", label: "السعرات", type: "number", unit: "سعرة" },
        { id: "protein", label: "البروتين", type: "number", unit: "جم" },
        { id: "carbs", label: "الكارب", type: "number", unit: "جم" },
        { id: "fat", label: "الدهون", type: "number", unit: "جم" },
        { id: "fiber", label: "الفايبر", type: "number", unit: "جم" }
      ]
    },
    {
      id: "drinks",
      label: "المياه والمشروبات",
      desc: "المياه، القهوة، الشاي، المشروبات الغازية، العصائر",
      fields: [
        { id: "water", label: "المياه", type: "number", unit: "لتر" },
        { id: "coffee", label: "القهوة", type: "number", unit: "كوب" },
        { id: "tea", label: "الشاي", type: "number", unit: "كوب" },
        { id: "soda", label: "مشروبات غازية", type: "number", unit: "كوب" },
        { id: "juice", label: "عصائر", type: "number", unit: "كوب" }
      ]
    },
    {
      id: "sleep",
      label: "النوم",
      desc: "عدد ساعات النوم، الجودة، وقت النوم والاستيقاظ",
      fields: [
        { id: "hours", label: "ساعات النوم", type: "number", unit: "ساعة" },
        { id: "quality", label: "جودة النوم", type: "select", options: ["ضعيف", "متوسط", "جيد", "ممتاز"] },
        { id: "bedTime", label: "وقت النوم", type: "time" },
        { id: "wakeTime", label: "وقت الاستيقاظ", type: "time" },
        { id: "notes", label: "ملاحظات", type: "textarea", full: true }
      ]
    },
    {
      id: "body",
      label: "الوزن والمقاسات",
      desc: "الوزن، الطول، BMI، محيط الخصر، نسبة الدهون",
      fields: [
        { id: "weight", label: "الوزن", type: "number", unit: "كجم" },
        { id: "height", label: "الطول", type: "number", unit: "سم" },
        { id: "waist", label: "محيط الخصر", type: "number", unit: "سم" },
        { id: "bodyFat", label: "نسبة الدهون", type: "number", unit: "%" },
        { id: "notes", label: "ملاحظات", type: "textarea", full: true }
      ]
    },
    {
      id: "diseases",
      label: "الأمراض والحالة الصحية",
      desc: "أمراض مزمنة، أعراض متكررة، حساسية، تاريخ مرضي",
      fields: [
        { id: "condition", label: "الحالة أو المرض", type: "text" },
        { id: "symptoms", label: "الأعراض", type: "textarea", full: true },
        { id: "allergy", label: "الحساسية", type: "text" },
        { id: "severity", label: "الشدة", type: "select", options: ["خفيف", "متوسط", "عالي"] }
      ]
    },
    {
      id: "medicine",
      label: "الأدوية",
      desc: "اسم الدواء، الجرعة، المواعيد، المدة، التحذيرات",
      fields: [
        { id: "name", label: "اسم الدواء", type: "text" },
        { id: "dose", label: "الجرعة", type: "text", placeholder: "500mg" },
        { id: "time", label: "الموعد", type: "time" },
        { id: "duration", label: "مدة الاستخدام", type: "text" },
        { id: "status", label: "الحالة", type: "select", options: ["مستحق", "تم أخذه", "متأخر"] },
        { id: "warnings", label: "تحذيرات", type: "textarea", full: true }
      ]
    },
    {
      id: "labs",
      label: "التحاليل والفحوصات",
      desc: "CBC، كبد، كلى، دهون، سكر، فيتامينات، ضغط",
      fields: [
        { id: "testName", label: "اسم التحليل", type: "text", placeholder: "CBC / Liver / Kidney" },
        { id: "result", label: "النتيجة", type: "text" },
        { id: "unit", label: "الوحدة", type: "text" },
        { id: "normalRange", label: "المعدل الطبيعي", type: "text" },
        { id: "doctorNote", label: "ملاحظة الطبيب", type: "textarea", full: true }
      ]
    },
    {
      id: "healthyHabits",
      label: "العادات الصحية",
      desc: "التدخين، السكر، الملح، السهر، الحركة اليومية",
      fields: [
        { id: "habit", label: "العادة", type: "text" },
        { id: "status", label: "الوضع", type: "select", options: ["جيدة", "تحتاج تحسين", "ممنوعة"] },
        { id: "frequency", label: "التكرار", type: "text" },
        { id: "notes", label: "ملاحظات", type: "textarea", full: true }
      ]
    },
    {
      id: "rules",
      label: "المسموحات والممنوعات",
      desc: "أكل مسموح، أكل ممنوع، أدوية ممنوعة، عادات ممنوعة",
      fields: [
        { id: "item", label: "العنصر", type: "text" },
        { id: "type", label: "النوع", type: "select", options: ["مسموح", "ممنوع", "بحذر"] },
        { id: "category", label: "الفئة", type: "select", options: ["أكل", "دواء", "عادة", "نشاط"] },
        { id: "reason", label: "السبب", type: "textarea", full: true }
      ]
    },
    {
      id: "medicalFollowup",
      label: "المتابعة الطبية",
      desc: "مواعيد دكاترة، روشتات، تشخيصات، ملاحظات",
      fields: [
        { id: "doctor", label: "الطبيب", type: "text" },
        { id: "appointment", label: "موعد المتابعة", type: "datetime-local" },
        { id: "diagnosis", label: "التشخيص", type: "text" },
        { id: "prescription", label: "الروشتة", type: "textarea", full: true },
        { id: "notes", label: "ملاحظات", type: "textarea", full: true }
      ]
    }
  ],
  learning: [
    {
      id: "academic",
      label: "الدراسة الأكاديمية",
      desc: "ماجستير، أبحاث، محاضرات، مراجع، مهام",
      fields: [
        { id: "program", label: "البرنامج أو المادة", type: "text" },
        { id: "task", label: "المهمة", type: "text" },
        { id: "hours", label: "ساعات المذاكرة", type: "number", unit: "ساعة" },
        { id: "deadline", label: "الموعد النهائي", type: "date" },
        { id: "notes", label: "ملاحظات", type: "textarea", full: true }
      ]
    },
    {
      id: "courses",
      label: "الكورسات",
      desc: "Data Science، English، Programming، Pharmacy",
      fields: [
        { id: "course", label: "اسم الكورس", type: "text" },
        { id: "field", label: "المجال", type: "text" },
        { id: "progress", label: "نسبة التقدم", type: "number", unit: "%" },
        { id: "hours", label: "ساعات اليوم", type: "number", unit: "ساعة" },
        { id: "nextLesson", label: "الدرس القادم", type: "text" }
      ]
    },
    {
      id: "reading",
      label: "القراءة",
      desc: "كتب، مقالات، أبحاث، ملخصات",
      fields: [
        { id: "title", label: "العنوان", type: "text" },
        { id: "type", label: "النوع", type: "select", options: ["كتاب", "مقال", "بحث", "ملخص"] },
        { id: "pages", label: "عدد الصفحات", type: "number" },
        { id: "summary", label: "ملخص", type: "textarea", full: true }
      ]
    },
    {
      id: "language",
      label: "اللغة",
      desc: "English level، كلمات جديدة، Speaking، Listening، Writing",
      fields: [
        { id: "language", label: "اللغة", type: "text", placeholder: "English" },
        { id: "level", label: "المستوى", type: "select", options: ["A1", "A2", "B1", "B2", "C1"] },
        { id: "newWords", label: "كلمات جديدة", type: "number" },
        { id: "speaking", label: "Speaking", type: "number", unit: "دقيقة" },
        { id: "listening", label: "Listening", type: "number", unit: "دقيقة" },
        { id: "writing", label: "Writing", type: "number", unit: "دقيقة" }
      ]
    },
    {
      id: "skills",
      label: "المهارات",
      desc: "Excel، SQL، Python، Power BI، Communication",
      fields: [
        { id: "skill", label: "المهارة", type: "text" },
        { id: "progress", label: "نسبة التقدم", type: "number", unit: "%" },
        { id: "level", label: "المستوى الحالي", type: "text" },
        { id: "practiceHours", label: "ساعات التدريب", type: "number", unit: "ساعة" },
        { id: "evidence", label: "دليل التقدم", type: "text" }
      ]
    },
    {
      id: "projects",
      label: "المشاريع",
      desc: "بورتفوليو، فريلانس، GitHub",
      fields: [
        { id: "project", label: "اسم المشروع", type: "text" },
        { id: "type", label: "النوع", type: "select", options: ["Portfolio", "Freelance", "GitHub", "شخصي"] },
        { id: "progress", label: "نسبة التقدم", type: "number", unit: "%" },
        { id: "status", label: "الحالة", type: "select", options: ["جاري", "مؤجل", "مكتمل"] },
        { id: "nextStep", label: "الخطوة القادمة", type: "text" }
      ]
    },
    {
      id: "dailyStudy",
      label: "المذاكرة اليومية",
      desc: "عدد ساعات التركيز، Pomodoro، To-do",
      fields: [
        { id: "focusHours", label: "ساعات التركيز", type: "number", unit: "ساعة" },
        { id: "pomodoro", label: "Pomodoro", type: "number" },
        { id: "todoDone", label: "مهام مكتملة", type: "number" },
        { id: "blocker", label: "معطل اليوم", type: "text" }
      ]
    },
    {
      id: "notes",
      label: "الملاحظات والمعرفة",
      desc: "Notes، أفكار، ملخصات، مصادر",
      fields: [
        { id: "title", label: "العنوان", type: "text" },
        { id: "source", label: "المصدر", type: "text" },
        { id: "note", label: "الملاحظة", type: "textarea", full: true },
        { id: "tags", label: "Tags", type: "text" }
      ]
    },
    {
      id: "thinking",
      label: "التفكير والتحليل",
      desc: "قرارات، مشاكل، حلول، Brainstorming",
      fields: [
        { id: "topic", label: "الموضوع", type: "text" },
        { id: "problem", label: "المشكلة", type: "textarea", full: true },
        { id: "solution", label: "الحل المقترح", type: "textarea", full: true },
        { id: "decision", label: "القرار", type: "text" }
      ]
    },
    {
      id: "productivity",
      label: "الإنتاجية",
      desc: "الأولويات، العادات، إنجاز اليوم، تأجيل المهام",
      fields: [
        { id: "wins", label: "إنجاز اليوم", type: "textarea", full: true },
        { id: "delayed", label: "المؤجل", type: "textarea", full: true },
        { id: "priority", label: "أولوية الغد", type: "text" },
        { id: "energy", label: "الطاقة", type: "select", options: ["منخفضة", "متوسطة", "عالية"] }
      ]
    }
  ],
  finance: [
    {
      id: "income",
      label: "الدخل",
      desc: "مرتب، فريلانس، شغل إضافي، دخل سلبي",
      fields: [
        { id: "source", label: "مصدر الدخل", type: "text" },
        { id: "amount", label: "المبلغ", type: "number", unit: "جنيه" },
        { id: "type", label: "النوع", type: "select", options: ["مرتب", "فريلانس", "شغل إضافي", "دخل سلبي"] },
        { id: "expected", label: "متوقع؟", type: "select", options: ["نعم", "لا"] }
      ]
    },
    {
      id: "expenses",
      label: "المصاريف",
      desc: "إيجار، أكل، مواصلات، فواتير، اشتراكات",
      fields: [
        { id: "category", label: "البند", type: "select", options: ["إيجار", "أكل", "مواصلات", "فواتير", "اشتراكات", "تعليم", "صحة", "أخرى"] },
        { id: "amount", label: "المبلغ", type: "number", unit: "جنيه" },
        { id: "payment", label: "طريقة الدفع", type: "select", options: ["كاش", "كارت", "محفظة", "تحويل"] },
        { id: "notes", label: "ملاحظات", type: "textarea", full: true }
      ]
    },
    {
      id: "debts",
      label: "الديون",
      desc: "كروت، أقساط، قروض، مواعيد السداد",
      fields: [
        { id: "debtName", label: "اسم الدين", type: "text" },
        { id: "remaining", label: "المتبقي", type: "number", unit: "جنيه" },
        { id: "installment", label: "القسط", type: "number", unit: "جنيه" },
        { id: "dueDate", label: "ميعاد السداد", type: "date" },
        { id: "status", label: "الحالة", type: "select", options: ["مستحق", "تم السداد", "متأخر"] }
      ]
    },
    {
      id: "savings",
      label: "الادخار",
      desc: "مبلغ مدخر، هدف الادخار، نسبة الادخار",
      fields: [
        { id: "saved", label: "المبلغ المدخر", type: "number", unit: "جنيه" },
        { id: "goal", label: "هدف الادخار", type: "number", unit: "جنيه" },
        { id: "purpose", label: "الغرض", type: "text" },
        { id: "monthlyTarget", label: "هدف الشهر", type: "number", unit: "جنيه" }
      ]
    },
    {
      id: "investments",
      label: "الاستثمار",
      desc: "ذهب، أسهم، شهادات، عملات، أصول",
      fields: [
        { id: "asset", label: "الأصل", type: "select", options: ["ذهب", "أسهم", "شهادات", "عملات", "أصول"] },
        { id: "value", label: "القيمة الحالية", type: "number", unit: "جنيه" },
        { id: "cost", label: "تكلفة الشراء", type: "number", unit: "جنيه" },
        { id: "notes", label: "ملاحظات", type: "textarea", full: true }
      ]
    },
    {
      id: "budget",
      label: "الميزانية الشهرية",
      desc: "Budget لكل بند",
      fields: [
        { id: "category", label: "البند", type: "text" },
        { id: "planned", label: "المخطط", type: "number", unit: "جنيه" },
        { id: "spent", label: "المصروف", type: "number", unit: "جنيه" },
        { id: "notes", label: "ملاحظات", type: "textarea", full: true }
      ]
    },
    {
      id: "currentWork",
      label: "العمل الحالي",
      desc: "مهام، حضور، أداء، KPIs",
      fields: [
        { id: "task", label: "المهمة", type: "text" },
        { id: "attendance", label: "الحضور", type: "select", options: ["حاضر", "إجازة", "تأخير"] },
        { id: "kpi", label: "KPI", type: "number", unit: "%" },
        { id: "feedback", label: "ملاحظة الأداء", type: "textarea", full: true }
      ]
    },
    {
      id: "freelance",
      label: "الفريلانس",
      desc: "عروض، عملاء، مشاريع، أرباح، تقييمات",
      fields: [
        { id: "client", label: "العميل", type: "text" },
        { id: "offer", label: "العرض أو المشروع", type: "text" },
        { id: "amount", label: "القيمة", type: "number", unit: "جنيه" },
        { id: "status", label: "الحالة", type: "select", options: ["مرسل", "مقبول", "مرفوض", "منتهي"] },
        { id: "rating", label: "التقييم", type: "number", unit: "/5" }
      ]
    },
    {
      id: "jobSearch",
      label: "البحث عن وظيفة",
      desc: "Jobs Applied، Interviews، CV versions",
      fields: [
        { id: "company", label: "الشركة", type: "text" },
        { id: "role", label: "الوظيفة", type: "text" },
        { id: "cvVersion", label: "نسخة CV", type: "text" },
        { id: "status", label: "الحالة", type: "select", options: ["Applied", "Interview", "Rejected", "Offer"] },
        { id: "nextAction", label: "الخطوة القادمة", type: "text" }
      ]
    },
    {
      id: "business",
      label: "البيزنس",
      desc: "أفكار مشاريع، دراسة جدوى، رأس المال",
      fields: [
        { id: "idea", label: "الفكرة", type: "text" },
        { id: "capital", label: "رأس المال", type: "number", unit: "جنيه" },
        { id: "feasibility", label: "دراسة الجدوى", type: "textarea", full: true },
        { id: "nextStep", label: "الخطوة القادمة", type: "text" }
      ]
    },
    {
      id: "bills",
      label: "الفواتير",
      desc: "كهرباء، مياه، غاز، إنترنت، موبايل",
      fields: [
        { id: "bill", label: "الفاتورة", type: "select", options: ["كهرباء", "مياه", "غاز", "إنترنت", "موبايل", "أخرى"] },
        { id: "amount", label: "المبلغ", type: "number", unit: "جنيه" },
        { id: "dueDate", label: "ميعاد الدفع", type: "date" },
        { id: "status", label: "الحالة", type: "select", options: ["مستحقة", "مدفوعة", "متأخرة"] }
      ]
    },
    {
      id: "financialDocs",
      label: "المستندات المالية",
      desc: "إيصالات، عقود، كشف حساب، ضرائب",
      fields: [
        { id: "docType", label: "نوع المستند", type: "select", options: ["إيصال", "عقد", "كشف حساب", "ضرائب", "أخرى"] },
        { id: "title", label: "العنوان", type: "text" },
        { id: "reference", label: "المرجع أو الرابط", type: "text" },
        { id: "notes", label: "ملاحظات", type: "textarea", full: true }
      ]
    }
  ],
  relationships: [
    {
      id: "family",
      label: "الأسرة",
      desc: "تواصل، زيارات، مسؤوليات، دعم",
      fields: [
        { id: "person", label: "الشخص", type: "text" },
        { id: "contactType", label: "نوع التواصل", type: "select", options: ["مكالمة", "زيارة", "رسالة", "دعم"] },
        { id: "quality", label: "جودة التواصل", type: "number", unit: "/10" },
        { id: "responsibility", label: "مسؤولية أو متابعة", type: "text" }
      ]
    },
    {
      id: "friends",
      label: "الأصدقاء",
      desc: "مقابلات، مكالمات، علاقات قوية وضعيفة",
      fields: [
        { id: "friend", label: "الصديق", type: "text" },
        { id: "contactType", label: "نوع التواصل", type: "select", options: ["مقابلة", "مكالمة", "رسالة"] },
        { id: "relationshipStrength", label: "قوة العلاقة", type: "number", unit: "/10" },
        { id: "nextFollowup", label: "متابعة قادمة", type: "date" }
      ]
    },
    {
      id: "loveMarriage",
      label: "الحب والزواج",
      desc: "تعارف، توافق، معايير، خطوات رسمية",
      fields: [
        { id: "stage", label: "المرحلة", type: "select", options: ["تفكير", "تعارف", "توافق", "خطوة رسمية", "متوقف"] },
        { id: "compatibility", label: "التوافق", type: "number", unit: "/10" },
        { id: "criteria", label: "المعايير", type: "textarea", full: true },
        { id: "nextStep", label: "الخطوة القادمة", type: "text" }
      ]
    },
    {
      id: "professional",
      label: "العلاقات المهنية",
      desc: "زملاء، مديرين، عملاء، Networking",
      fields: [
        { id: "person", label: "الشخص", type: "text" },
        { id: "role", label: "الدور", type: "select", options: ["زميل", "مدير", "عميل", "شبكة علاقات"] },
        { id: "purpose", label: "الغرض", type: "text" },
        { id: "followup", label: "متابعة", type: "date" }
      ]
    },
    {
      id: "mood",
      label: "الحالة المزاجية",
      desc: "Mood يومي، توتر، غضب، رضا",
      fields: [
        { id: "mood", label: "Mood", type: "number", unit: "/10" },
        { id: "stress", label: "التوتر", type: "number", unit: "/10" },
        { id: "anger", label: "الغضب", type: "number", unit: "/10" },
        { id: "satisfaction", label: "الرضا", type: "number", unit: "/10" },
        { id: "trigger", label: "السبب", type: "text" }
      ]
    },
    {
      id: "support",
      label: "الدعم النفسي",
      desc: "Journaling، تفريغ مشاعر، Therapy",
      fields: [
        { id: "method", label: "الطريقة", type: "select", options: ["Journaling", "تفريغ مشاعر", "Therapy", "حديث مع شخص"] },
        { id: "minutes", label: "المدة", type: "number", unit: "دقيقة" },
        { id: "effect", label: "الأثر", type: "select", options: ["ضعيف", "متوسط", "جيد", "قوي"] },
        { id: "note", label: "ما الذي خرجت به؟", type: "textarea", full: true }
      ]
    },
    {
      id: "boundaries",
      label: "الحدود الشخصية",
      desc: "مين يستنزفك، مين يدعمك، مواقف تحتاج حدود",
      fields: [
        { id: "person", label: "الشخص أو الموقف", type: "text" },
        { id: "impact", label: "الأثر", type: "select", options: ["يدعمني", "محايد", "يستنزفني"] },
        { id: "boundary", label: "الحد المطلوب", type: "textarea", full: true },
        { id: "status", label: "الحالة", type: "select", options: ["محتاج فعل", "تم", "متابعة"] }
      ]
    },
    {
      id: "communication",
      label: "التواصل",
      desc: "مكالمات مهمة، رسائل، متابعة ناس مهمة",
      fields: [
        { id: "person", label: "الشخص", type: "text" },
        { id: "type", label: "النوع", type: "select", options: ["مكالمة", "رسالة", "مقابلة"] },
        { id: "importance", label: "الأهمية", type: "select", options: ["عادية", "مهمة", "عاجلة"] },
        { id: "result", label: "النتيجة", type: "text" }
      ]
    },
    {
      id: "conflicts",
      label: "الخلافات",
      desc: "سبب المشكلة، الشخص، الحل، المتابعة",
      fields: [
        { id: "person", label: "الشخص", type: "text" },
        { id: "reason", label: "سبب المشكلة", type: "textarea", full: true },
        { id: "solution", label: "الحل", type: "textarea", full: true },
        { id: "status", label: "الحالة", type: "select", options: ["مفتوح", "قيد الحل", "مغلق"] }
      ]
    },
    {
      id: "gratitude",
      label: "الامتنان",
      desc: "حاجات كويسة حصلت، أشخاص ساعدوك",
      fields: [
        { id: "thing", label: "ممتن لإيه؟", type: "textarea", full: true },
        { id: "person", label: "شخص ساعدك", type: "text" },
        { id: "feeling", label: "الإحساس", type: "text" }
      ]
    },
    {
      id: "confidence",
      label: "الثقة بالنفس",
      desc: "إنجازات، مواقف قوية، نقاط تحسن",
      fields: [
        { id: "achievement", label: "إنجاز", type: "text" },
        { id: "strongMoment", label: "موقف قوي", type: "textarea", full: true },
        { id: "improvement", label: "نقطة تحسين", type: "text" },
        { id: "confidence", label: "الثقة اليوم", type: "number", unit: "/10" }
      ]
    }
  ],
  meaning: [
    {
      id: "worship",
      label: "العبادة",
      desc: "صلاة، قرآن، ذكر، دعاء، صيام",
      fields: [
        { id: "prayers", label: "عدد الصلوات", type: "number", unit: "/5" },
        { id: "quranPages", label: "صفحات القرآن", type: "number" },
        { id: "dhikr", label: "الذكر", type: "number", unit: "مرة" },
        { id: "dua", label: "دعاء", type: "text" },
        { id: "fasting", label: "صيام", type: "select", options: ["لا", "نعم"] }
      ]
    },
    {
      id: "values",
      label: "القيم",
      desc: "الصدق، الالتزام، الرحمة، الكرامة، الاستقلال",
      fields: [
        { id: "value", label: "قيمة اليوم", type: "text" },
        { id: "score", label: "الالتزام", type: "number", unit: "/10" },
        { id: "evidence", label: "دليل الالتزام", type: "textarea", full: true }
      ]
    },
    {
      id: "personalGoal",
      label: "الهدف الشخصي",
      desc: "أنا عايز أوصل لإيه؟ وليه؟",
      fields: [
        { id: "goal", label: "الهدف", type: "text" },
        { id: "why", label: "ليه؟", type: "textarea", full: true },
        { id: "progress", label: "التقدم", type: "number", unit: "%" },
        { id: "nextStep", label: "الخطوة القادمة", type: "text" }
      ]
    },
    {
      id: "mission",
      label: "الرسالة",
      desc: "الأثر اللي عايز تسيبه في الناس أو المجال",
      fields: [
        { id: "mission", label: "الرسالة", type: "textarea", full: true },
        { id: "field", label: "المجال", type: "text" },
        { id: "impact", label: "الأثر", type: "textarea", full: true }
      ]
    },
    {
      id: "ethics",
      label: "الأخلاق والقرارات",
      desc: "هل قراراتي ماشية مع قيمي؟",
      fields: [
        { id: "decision", label: "القرار", type: "text" },
        { id: "aligned", label: "متوافق مع القيم؟", type: "select", options: ["نعم", "جزئيا", "لا"] },
        { id: "reason", label: "السبب", type: "textarea", full: true }
      ]
    },
    {
      id: "giving",
      label: "العطاء",
      desc: "صدقة، مساعدة، تعليم غيرك، دعم الناس",
      fields: [
        { id: "type", label: "نوع العطاء", type: "select", options: ["صدقة", "مساعدة", "تعليم", "دعم"] },
        { id: "amount", label: "قيمة أو وقت", type: "text" },
        { id: "person", label: "لمن؟", type: "text" },
        { id: "note", label: "ملاحظة", type: "textarea", full: true }
      ]
    },
    {
      id: "reflection",
      label: "التأمل والمراجعة",
      desc: "مراجعة أسبوعية، شهرية، Lessons learned",
      fields: [
        { id: "type", label: "نوع المراجعة", type: "select", options: ["يومية", "أسبوعية", "شهرية"] },
        { id: "right", label: "عملت إيه صح؟", type: "textarea", full: true },
        { id: "change", label: "أغير إيه بكرة؟", type: "textarea", full: true },
        { id: "lesson", label: "Lesson learned", type: "text" }
      ]
    },
    {
      id: "acceptance",
      label: "الرضا",
      desc: "الحاجات اللي ممتن لها، الحاجات اللي محتاجة قبول",
      fields: [
        { id: "gratitude", label: "ممتن لإيه؟", type: "textarea", full: true },
        { id: "accept", label: "محتاج أقبل إيه؟", type: "textarea", full: true },
        { id: "innerPeace", label: "مؤشر الرضا", type: "number", unit: "/10" }
      ]
    },
    {
      id: "identity",
      label: "الهوية",
      desc: "أنا مين؟ عايز أكون مين؟",
      fields: [
        { id: "currentIdentity", label: "أنا مين الآن؟", type: "textarea", full: true },
        { id: "futureIdentity", label: "عايز أكون مين؟", type: "textarea", full: true },
        { id: "proof", label: "دليل عملي اليوم", type: "text" }
      ]
    },
    {
      id: "longPlan",
      label: "الخطة طويلة المدى",
      desc: "1 سنة، 3 سنين، 5 سنين، 10 سنين",
      fields: [
        { id: "oneYear", label: "خطة سنة", type: "textarea", full: true },
        { id: "threeYears", label: "خطة 3 سنين", type: "textarea", full: true },
        { id: "fiveYears", label: "خطة 5 سنين", type: "textarea", full: true },
        { id: "tenYears", label: "خطة 10 سنين", type: "textarea", full: true }
      ]
    }
  ]
};

const financeMoneyIds = new Set(["income", "expenses", "debts", "savings", "investments", "budget", "bills", "financialDocs"]);
const financeWorkIds = new Set(["currentWork", "freelance", "jobSearch", "business"]);

moduleGroups.finance = moduleGroups.finance.map((module) => ({
  ...module,
  category: financeMoneyIds.has(module.id) ? "money" : "work"
}));

moduleGroups.finance.push(
  {
    id: "incomeStreams",
    category: "money",
    label: "مصادر الدخل المتنوعة",
    desc: "مرتب، عمولة، فريلانس، دخل سلبي، تكرارية الدخل وثباته",
    fields: [
      { id: "source", label: "مصدر الدخل", type: "text" },
      { id: "streamType", label: "نوع المصدر", type: "select", options: ["مرتب ثابت", "عمولة", "فريلانس", "دخل سلبي", "استثمار", "مشروع", "منحة", "أخرى"] },
      { id: "frequency", label: "التكرار", type: "select", options: ["يومي", "أسبوعي", "شهري", "ربع سنوي", "متقطع"] },
      { id: "amount", label: "متوسط المبلغ", type: "number", unit: "جنيه" },
      { id: "stability", label: "درجة الثبات", type: "number", unit: "/10" },
      { id: "growthPlan", label: "خطة زيادة الدخل", type: "textarea", full: true }
    ]
  },
  {
    id: "expenseAnalysis",
    category: "money",
    label: "تحليل النفقات",
    desc: "تصنيف الضروري والكمالي، أسباب الزيادة، وخطة التخفيض",
    fields: [
      { id: "category", label: "الفئة الرئيسية", type: "select", options: ["سكن", "أكل", "مواصلات", "صحة", "تعليم", "ترفيه", "اشتراكات", "ديون", "أخرى"] },
      { id: "subcategory", label: "الفئة الفرعية", type: "text" },
      { id: "necessity", label: "نوع النفقة", type: "select", options: ["ضرورية", "مهمة", "كمالية", "تسريب مالي"] },
      { id: "amount", label: "المبلغ", type: "number", unit: "جنيه" },
      { id: "reason", label: "سبب الصرف", type: "text" },
      { id: "cutPlan", label: "خطة التخفيض أو التحكم", type: "textarea", full: true }
    ]
  },
  {
    id: "emergencyFund",
    category: "money",
    label: "صندوق الطوارئ",
    desc: "عدد شهور الأمان، الاحتياج الشهري، الفجوة، وخطة التمويل",
    fields: [
      { id: "current", label: "المبلغ الحالي", type: "number", unit: "جنيه" },
      { id: "monthlyNeed", label: "الاحتياج الشهري", type: "number", unit: "جنيه" },
      { id: "targetMonths", label: "عدد شهور الأمان", type: "number", unit: "شهر" },
      { id: "monthlyContribution", label: "الإضافة الشهرية", type: "number", unit: "جنيه" },
      { id: "location", label: "مكان حفظ الصندوق", type: "select", options: ["حساب بنكي", "محفظة", "كاش", "ذهب", "شهادة", "أخرى"] },
      { id: "rules", label: "قواعد استخدام الطوارئ", type: "textarea", full: true }
    ]
  },
  {
    id: "cashflowPlan",
    category: "money",
    label: "خطة التدفق النقدي",
    desc: "رصيد بداية الشهر، الداخل، الخارج، المتبقي، ونقاط الخطر",
    fields: [
      { id: "month", label: "الشهر", type: "month" },
      { id: "openingBalance", label: "رصيد البداية", type: "number", unit: "جنيه" },
      { id: "expectedIncome", label: "الدخل المتوقع", type: "number", unit: "جنيه" },
      { id: "fixedExpenses", label: "المصاريف الثابتة", type: "number", unit: "جنيه" },
      { id: "variableBudget", label: "ميزانية المتغيرات", type: "number", unit: "جنيه" },
      { id: "riskNote", label: "ملاحظات المخاطر", type: "textarea", full: true }
    ]
  },
  {
    id: "financialGoals",
    category: "money",
    label: "الأهداف المالية",
    desc: "هدف مالي، قيمة مستهدفة، موعد، أولوية، وخطة تنفيذ",
    fields: [
      { id: "goal", label: "الهدف", type: "text" },
      { id: "targetAmount", label: "المبلغ المستهدف", type: "number", unit: "جنيه" },
      { id: "currentAmount", label: "المبلغ الحالي", type: "number", unit: "جنيه" },
      { id: "deadline", label: "موعد الوصول", type: "date" },
      { id: "priority", label: "الأولوية", type: "select", options: ["حرجة", "عالية", "متوسطة", "منخفضة"] },
      { id: "plan", label: "خطة التنفيذ", type: "textarea", full: true }
    ]
  },
  {
    id: "debtPlan",
    category: "money",
    label: "خطة سداد الديون",
    desc: "استراتيجية السداد، الفائدة، أقل قسط، وسداد إضافي",
    fields: [
      { id: "debtName", label: "اسم الدين", type: "text" },
      { id: "strategy", label: "الاستراتيجية", type: "select", options: ["Snowball", "Avalanche", "قسط ثابت", "تسوية"] },
      { id: "interestRate", label: "الفائدة", type: "number", unit: "%" },
      { id: "minPayment", label: "أقل قسط", type: "number", unit: "جنيه" },
      { id: "extraPayment", label: "سداد إضافي", type: "number", unit: "جنيه" },
      { id: "payoffDate", label: "تاريخ الإغلاق المتوقع", type: "date" }
    ]
  },
  {
    id: "workTypes",
    category: "work",
    label: "أنواع العمل والأماكن",
    desc: "دوام كامل، جزئي، ريموت، هجين، مكان العمل ونوع العقد",
    fields: [
      { id: "workType", label: "نوع العمل", type: "select", options: ["دوام كامل", "دوام جزئي", "ريموت", "هجين", "شيفتات", "مشروع", "تدريب", "استشارة"] },
      { id: "workplace", label: "مكان العمل", type: "text" },
      { id: "contract", label: "نوع التعاقد", type: "select", options: ["موظف", "Contract", "Freelance", "Internship", "بدون عقد"] },
      { id: "hours", label: "ساعات العمل", type: "number", unit: "ساعة" },
      { id: "incomePotential", label: "قابلية زيادة الدخل", type: "number", unit: "/10" },
      { id: "notes", label: "ملاحظات", type: "textarea", full: true }
    ]
  },
  {
    id: "jobLinks",
    category: "work",
    label: "روابط الوظائف",
    desc: "روابط التقديم، المصدر، الموعد، الحالة، والمتابعة",
    fields: [
      { id: "company", label: "الشركة", type: "text" },
      { id: "role", label: "الوظيفة", type: "text" },
      { id: "url", label: "رابط الوظيفة", type: "url" },
      { id: "source", label: "المصدر", type: "select", options: ["LinkedIn", "Wuzzuf", "Indeed", "Referral", "Company site", "Facebook", "أخرى"] },
      { id: "deadline", label: "آخر موعد", type: "date" },
      { id: "status", label: "الحالة", type: "select", options: ["محفوظة", "تم التقديم", "مقابلة", "مرفوضة", "عرض"] },
      { id: "notes", label: "ملاحظات", type: "textarea", full: true }
    ]
  },
  {
    id: "careerPlans",
    category: "work",
    label: "الخطط المستقبلية المهنية",
    desc: "الدور المستهدف، فجوات المهارات، الراتب، والمرحلة القادمة",
    fields: [
      { id: "targetRole", label: "الدور المستهدف", type: "text" },
      { id: "skillGap", label: "فجوة المهارات", type: "textarea", full: true },
      { id: "timeline", label: "الجدول الزمني", type: "select", options: ["3 شهور", "6 شهور", "سنة", "3 سنوات"] },
      { id: "salaryTarget", label: "الراتب المستهدف", type: "number", unit: "جنيه" },
      { id: "nextMilestone", label: "المرحلة القادمة", type: "text" },
      { id: "risk", label: "مخاطر أو معوقات", type: "textarea", full: true }
    ]
  },
  {
    id: "workTasks",
    category: "work",
    label: "تاسكات العمل",
    desc: "مهام العمل، المشروع، الأولوية، الموعد، وملف مرتبط",
    fields: [
      { id: "task", label: "المهمة", type: "text" },
      { id: "project", label: "المشروع", type: "text" },
      { id: "priority", label: "الأولوية", type: "select", options: ["حرجة", "عالية", "متوسطة", "منخفضة"] },
      { id: "dueDate", label: "موعد التسليم", type: "date" },
      { id: "status", label: "الحالة", type: "select", options: ["لم تبدأ", "قيد التنفيذ", "مراجعة", "مكتملة"] },
      { id: "attachment", label: "ملف مرتبط", type: "file" },
      { id: "notes", label: "ملاحظات", type: "textarea", full: true }
    ]
  },
  {
    id: "freelancePipeline",
    category: "work",
    label: "Pipeline الفريلانس",
    desc: "منصة، عميل، مرحلة التفاوض، السعر، والملفات",
    fields: [
      { id: "platform", label: "المنصة", type: "select", options: ["Upwork", "Khamsat", "Mostaql", "LinkedIn", "Direct", "أخرى"] },
      { id: "client", label: "العميل", type: "text" },
      { id: "project", label: "المشروع", type: "text" },
      { id: "stage", label: "المرحلة", type: "select", options: ["Lead", "Proposal", "Negotiation", "Active", "Delivered", "Closed"] },
      { id: "price", label: "السعر", type: "number", unit: "جنيه" },
      { id: "deadline", label: "موعد التسليم", type: "date" },
      { id: "attachment", label: "ملف العرض أو المتطلبات", type: "file" },
      { id: "notes", label: "ملاحظات", type: "textarea", full: true }
    ]
  },
  {
    id: "requiredFiles",
    category: "work",
    label: "الملفات المطلوبة",
    desc: "CV، Cover Letter، Portfolio، شهادات، ونسخ محدثة",
    fields: [
      { id: "fileTitle", label: "اسم الملف", type: "text" },
      { id: "purpose", label: "الغرض", type: "select", options: ["CV", "Cover Letter", "Portfolio", "Certificate", "Proposal", "Contract", "Other"] },
      { id: "version", label: "الإصدار", type: "text" },
      { id: "attachment", label: "تحميل الملف", type: "file" },
      { id: "expiry", label: "يحتاج تحديث قبل", type: "date" },
      { id: "notes", label: "ملاحظات", type: "textarea", full: true }
    ]
  },
  {
    id: "workNotes",
    category: "work",
    label: "ملاحظات العمل",
    desc: "قرارات، اجتماعات، أفكار تطوير، ومتابعات",
    fields: [
      { id: "topic", label: "الموضوع", type: "text" },
      { id: "noteType", label: "نوع الملاحظة", type: "select", options: ["اجتماع", "قرار", "فكرة", "مشكلة", "متابعة"] },
      { id: "note", label: "الملاحظة", type: "textarea", full: true },
      { id: "decision", label: "قرار أو نتيجة", type: "text" },
      { id: "followup", label: "متابعة", type: "date" }
    ]
  }
);

moduleGroups.health.push(
  {
    id: "habitTracking",
    label: "تتبع العادات الصحية",
    desc: "عادة، هدف يومي، سلسلة الالتزام، محفزات، ومكافأة",
    fields: [
      { id: "habit", label: "العادة", type: "text" },
      { id: "target", label: "الهدف اليومي", type: "text" },
      { id: "streak", label: "Streak", type: "number", unit: "يوم" },
      { id: "completion", label: "نسبة الالتزام", type: "number", unit: "%" },
      { id: "trigger", label: "المحفز", type: "text" },
      { id: "reward", label: "مكافأة بسيطة", type: "text" },
      { id: "note", label: "ملاحظة يومية", type: "textarea", full: true }
    ]
  },
  {
    id: "healthJournal",
    label: "مذكرات صحية يومية",
    desc: "طاقة، شهية، أعراض، وجبة مؤثرة، وقرار صحي",
    fields: [
      { id: "energy", label: "الطاقة", type: "number", unit: "/10" },
      { id: "appetite", label: "الشهية", type: "select", options: ["منخفضة", "طبيعية", "عالية"] },
      { id: "symptoms", label: "أعراض اليوم", type: "textarea", full: true },
      { id: "bestChoice", label: "أفضل اختيار صحي", type: "text" },
      { id: "tomorrowAdjustment", label: "تعديل بكرة", type: "textarea", full: true }
    ]
  }
);

moduleGroups.learning.push(
  {
    id: "learningHabits",
    label: "عادات التعلم",
    desc: "عادة مذاكرة، وقت ثابت، بيئة، مانع، ونسبة الالتزام",
    fields: [
      { id: "habit", label: "عادة التعلم", type: "text" },
      { id: "fixedTime", label: "وقت ثابت", type: "time" },
      { id: "environment", label: "بيئة التعلم", type: "text" },
      { id: "blocker", label: "المانع", type: "text" },
      { id: "completion", label: "الالتزام", type: "number", unit: "%" },
      { id: "note", label: "ملاحظة", type: "textarea", full: true }
    ]
  },
  {
    id: "knowledgeVault",
    label: "مستودع المعرفة",
    desc: "فكرة، مصدر، اقتباس، تطبيق عملي، وربط بمشروع",
    fields: [
      { id: "idea", label: "الفكرة", type: "text" },
      { id: "source", label: "المصدر", type: "text" },
      { id: "quote", label: "اقتباس أو ملخص", type: "textarea", full: true },
      { id: "application", label: "تطبيق عملي", type: "textarea", full: true },
      { id: "linkedProject", label: "مشروع مرتبط", type: "text" }
    ]
  }
);

moduleGroups.relationships.push(
  {
    id: "dailyJournal",
    label: "الكتابات اليومية والمذكرات",
    desc: "موقف، شعور، احتياج، رد فعل، وخلاصة",
    fields: [
      { id: "event", label: "موقف اليوم", type: "textarea", full: true },
      { id: "feeling", label: "الشعور الأساسي", type: "text" },
      { id: "need", label: "الاحتياج الحقيقي", type: "text" },
      { id: "response", label: "رد فعلي", type: "textarea", full: true },
      { id: "lesson", label: "خلاصة", type: "text" }
    ]
  },
  {
    id: "socialPlans",
    label: "خطط العلاقات والمتابعة",
    desc: "شخص، هدف التواصل، موعد، رسالة، ونتيجة",
    fields: [
      { id: "person", label: "الشخص", type: "text" },
      { id: "relationship", label: "نوع العلاقة", type: "select", options: ["أسرة", "صديق", "مهني", "زواج", "دعم"] },
      { id: "goal", label: "هدف التواصل", type: "text" },
      { id: "date", label: "موعد التواصل", type: "date" },
      { id: "messageDraft", label: "مسودة الرسالة", type: "textarea", full: true },
      { id: "result", label: "النتيجة", type: "textarea", full: true }
    ]
  }
);

moduleGroups.meaning.push(
  {
    id: "spiritualJournal",
    label: "مذكرات المعنى والروح",
    desc: "لحظة معنى، قيمة ظهرت، دعاء، درس، ونية الغد",
    fields: [
      { id: "moment", label: "لحظة معنى", type: "textarea", full: true },
      { id: "value", label: "القيمة التي ظهرت", type: "text" },
      { id: "dua", label: "دعاء أو نية", type: "text" },
      { id: "lesson", label: "درس اليوم", type: "textarea", full: true },
      { id: "tomorrowIntention", label: "نية الغد", type: "text" }
    ]
  },
  {
    id: "weeklyReview",
    label: "المراجعة الأسبوعية العميقة",
    desc: "ما نجح، ما لم ينجح، قرار، عادة، وخطوة قادمة",
    fields: [
      { id: "worked", label: "ما نجح", type: "textarea", full: true },
      { id: "failed", label: "ما لم ينجح", type: "textarea", full: true },
      { id: "decision", label: "قرار الأسبوع", type: "text" },
      { id: "habit", label: "عادة الأسبوع القادم", type: "text" },
      { id: "nextStep", label: "خطوة قادمة", type: "text" }
    ]
  },
  {
    id: "goldZakat",
    label: "زكاة الذهب",
    desc: "حساب زكاة الذهب حسب الجرام والعيار وسعر السوق",
    fields: [
      { id: "grams", label: "عدد الجرامات", type: "number", unit: "جرام" },
      { id: "karat", label: "العيار", type: "select", options: ["24", "21", "18"] },
      { id: "gramPrice", label: "سعر الجرام", type: "number", unit: "جنيه" },
      { id: "zakatDue", label: "قيمة الزكاة المحسوبة", type: "number", unit: "جنيه" },
      { id: "paid", label: "تم الدفع؟", type: "select", options: ["لا", "نعم", "جزئي"] },
      { id: "notes", label: "ملاحظات شرعية أو شخصية", type: "textarea", full: true }
    ]
  },
  {
    id: "moneyZakat",
    label: "زكاة المال",
    desc: "أموال، ادخار، استثمارات، نصاب، قيمة الزكاة، وتاريخ الإخراج",
    fields: [
      { id: "cash", label: "النقد والادخار", type: "number", unit: "جنيه" },
      { id: "investments", label: "الاستثمارات الزكوية", type: "number", unit: "جنيه" },
      { id: "debtsDeducted", label: "ديون تخصم", type: "number", unit: "جنيه" },
      { id: "nisab", label: "النصاب", type: "number", unit: "جنيه" },
      { id: "zakatDue", label: "قيمة الزكاة", type: "number", unit: "جنيه" },
      { id: "dueDate", label: "تاريخ الإخراج", type: "date" }
    ]
  },
  {
    id: "charity",
    label: "الصدقات والعطاء",
    desc: "صدقة، جهة، مبلغ، نية، أثر، ومتابعة",
    fields: [
      { id: "charityType", label: "نوع الصدقة", type: "select", options: ["مال", "طعام", "تعليم", "وقت", "مساعدة", "أخرى"] },
      { id: "amount", label: "المبلغ أو الوقت", type: "text" },
      { id: "recipient", label: "الجهة أو الشخص", type: "text" },
      { id: "intention", label: "النية", type: "text" },
      { id: "impact", label: "الأثر", type: "textarea", full: true },
      { id: "followup", label: "متابعة", type: "date" }
    ]
  }
);

const financePlanningModuleIds = new Set(["cashflowPlan", "financialGoals", "debtPlan", "careerPlans"]);
moduleGroups.finance.forEach((module) => {
  if (financePlanningModuleIds.has(module.id)) module.category = "planning";
});

const state = {
  page: "home",
  module: {
    health: "gym",
    learning: "courses",
    finance: "income",
    relationships: "mood",
    meaning: "worship"
  },
  financeTab: "money",
  entryContext: null,
  db: null,
  firebase: {
    enabled: false,
    ready: false,
    status: "local",
    db: null,
    api: null,
    collection: "life_os_users"
  },
  market: {
    loading: false,
    error: "",
    data: null,
    goldGrams: 10,
    goldKarat: "21",
    zakatCash: 100000,
    aiResponses: {}
  }
};

const elements = {};

document.addEventListener("DOMContentLoaded", () => {
  cacheElements();
  state.db = loadDB();
  seedIfNeeded();
  bindStaticEvents();
  renderAuthOrApp();
  initFirebaseCloud();
});

function cacheElements() {
  elements.authScreen = document.getElementById("authScreen");
  elements.appShell = document.getElementById("appShell");
  elements.sideNav = document.getElementById("sideNav");
  elements.content = document.getElementById("content");
  elements.topProfileImage = document.getElementById("topProfileImage");
  elements.topUserName = document.getElementById("topUserName");
  elements.topUserSubtitle = document.getElementById("topUserSubtitle");
  elements.loginForm = document.getElementById("loginForm");
  elements.registerForm = document.getElementById("registerForm");
  elements.entryDialog = document.getElementById("entryDialog");
  elements.entryForm = document.getElementById("entryForm");
  elements.entryFields = document.getElementById("entryFormFields");
  elements.entryTitle = document.getElementById("entryDialogTitle");
  elements.entrySubtitle = document.getElementById("entryDialogSubtitle");
  elements.quickTaskDialog = document.getElementById("quickTaskDialog");
  elements.quickTaskForm = document.getElementById("quickTaskForm");
  elements.searchDialog = document.getElementById("searchDialog");
  elements.searchInput = document.getElementById("globalSearchInput");
  elements.searchResults = document.getElementById("searchResults");
  elements.notificationsDialog = document.getElementById("notificationsDialog");
  elements.notificationsContent = document.getElementById("notificationsContent");
  elements.toast = document.getElementById("toast");
}

function bindStaticEvents() {
  document.querySelectorAll("[data-auth-tab]").forEach((button) => {
    button.addEventListener("click", () => switchAuthTab(button.dataset.authTab));
  });

  elements.loginForm.addEventListener("submit", onLogin);
  elements.registerForm.addEventListener("submit", onRegister);
  document.getElementById("demoLoginBtn").addEventListener("click", loginDemo);
  document.getElementById("quickAddBtn").addEventListener("click", openQuickTaskDialog);
  document.getElementById("exportReportBtn").addEventListener("click", exportReport);
  document.getElementById("searchBtn").addEventListener("click", openSearch);
  document.getElementById("closeSearchBtn").addEventListener("click", () => elements.searchDialog.close());
  document.getElementById("closeNotificationsBtn").addEventListener("click", () => elements.notificationsDialog.close());
  document.getElementById("notificationsBtn").addEventListener("click", showNotifications);

  elements.sideNav.addEventListener("click", onNavClick);
  document.addEventListener("click", onDocumentFallbackClick);
  elements.entryForm.addEventListener("submit", onEntrySubmit);
  elements.quickTaskForm.addEventListener("submit", onQuickTaskSubmit);
  elements.content.addEventListener("click", onContentClick);
  elements.content.addEventListener("submit", onContentSubmit);
  elements.content.addEventListener("change", onContentChange);
  elements.searchInput.addEventListener("input", renderSearchResults);
}

function loadDB() {
  try {
    const stored = localStorage.getItem(DB_KEY);
    if (stored) return JSON.parse(stored);
    const legacy = localStorage.getItem(LEGACY_DB_KEY);
    if (legacy) return JSON.parse(legacy);
  } catch (error) {
    console.warn("Failed to read database", error);
  }
  return { users: {}, userOrder: [], version: 2 };
}

function saveDB() {
  state.db.version = 2;
  state.db.updatedAt = nowISO();
  localStorage.setItem(DB_KEY, JSON.stringify(state.db));
  queueFirebaseSync();
}

function seedIfNeeded() {
  if (!state.db.users) state.db.users = {};
  if (!state.db.userOrder) state.db.userOrder = [];
  state.db.systemUserCount = SYSTEM_USER_COUNT;
  Object.values(state.db.users).forEach((user, index) => {
    if (!user.username) user.username = user.email?.split("@")[0] || `legacy${String(index + 1).padStart(3, "0")}`;
    ensureUserShape(user);
  });
  pruneSystemUsers();

  const firstCredential = getSystemCredential(1);
  if (!Object.values(state.db.users).some((user) => user.username === firstCredential.username)) {
    const user = createSystemUser(1);
    seedDemoData(user);
    state.db.users[user.id] = user;
    state.db.userOrder.push(user.id);
  }
  saveDB();
}

function pruneSystemUsers() {
  Object.entries(state.db.users).forEach(([userId, user]) => {
    if (!user.systemUser) return;
    const systemIndex = findSystemUserIndex(user.username);
    if (!systemIndex) {
      delete state.db.users[userId];
    }
  });
  state.db.userOrder = state.db.userOrder.filter((userId) => Boolean(state.db.users[userId]));
}

function createSystemUser(index) {
  const credential = getSystemCredential(index);
  return createUser(`مستخدم ${String(index).padStart(3, "0")}`, credential.username, credential.password, {
    email: `${credential.username}@lifeos.local`,
    systemUser: true
  });
}

function findSystemUserIndex(username) {
  const match = /^user(\d{3,5})$/i.exec(username);
  if (!match) return 0;
  const index = Number(match[1]);
  return index >= 1 && index <= SYSTEM_USER_COUNT ? index : 0;
}

function getOrCreateSystemUser(username, password) {
  const existing = Object.values(state.db.users).find((item) => item.username === username);
  if (existing) return existing.password === password ? existing : null;
  const index = findSystemUserIndex(username);
  if (!index) return null;
  const credential = getSystemCredential(index);
  if (credential.password !== password) return null;
  const user = createSystemUser(index);
  state.db.users[user.id] = user;
  state.db.userOrder.push(user.id);
  saveDB();
  return user;
}

function createUser(name, usernameOrEmail, password, options = {}) {
  const username = (options.username || String(usernameOrEmail).split("@")[0]).toLowerCase().trim();
  const email = (options.email || (String(usernameOrEmail).includes("@") ? String(usernameOrEmail) : `${username}@lifeos.local`)).toLowerCase().trim();
  return {
    id: id(),
    name,
    username,
    email,
    password,
    systemUser: Boolean(options.systemUser),
    avatar: defaultAvatar(name),
    createdAt: nowISO(),
    profile: {
      subtitle: "لديك يوم رائع",
      phone: "",
      age: "",
      goal: "بناء حياة متوازنة ومنظمة",
      city: "القاهرة",
      height: "",
      targetWeight: ""
    },
    settings: {
      accent: "green",
      dailyCaloriesTarget: 2200,
      waterTarget: 2.5,
      stepsTarget: 8000,
      sleepTarget: 7,
      learningTarget: 2,
      savingsTargetRate: 20
    },
    data: {
      entries: createEmptyEntryBuckets(),
      tasks: [],
      habits: defaultHabits()
    }
  };
}

function getSystemCredential(index) {
  const username = `user${String(index).padStart(3, "0")}`;
  return { username, password: generateSystemPassword(index) };
}

function generateSystemPassword(index) {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789";
  let seed = index * 9301 + 49297;
  let password = "LO-";
  for (let i = 0; i < 9; i += 1) {
    seed = (seed * 233280 + 12345 + index * 97 + i * 31) % 1000003;
    password += chars[seed % chars.length];
  }
  return password;
}

function createEmptyEntryBuckets() {
  const entries = {};
  Object.keys(moduleGroups).forEach((domainId) => {
    entries[domainId] = {};
    moduleGroups[domainId].forEach((module) => {
      entries[domainId][module.id] = [];
    });
  });
  return entries;
}

function ensureUserShape(user) {
  if (!user.data) user.data = {};
  if (!user.data.entries) user.data.entries = createEmptyEntryBuckets();
  if (!user.data.tasks) user.data.tasks = [];
  if (!user.data.habits) user.data.habits = defaultHabits();
  if (!user.data.planning) user.data.planning = { journals: [], goals: [] };
  if (!user.data.planning.journals) user.data.planning.journals = [];
  if (!user.data.planning.goals) user.data.planning.goals = [];
  Object.keys(moduleGroups).forEach((domainId) => {
    if (!user.data.entries[domainId]) user.data.entries[domainId] = {};
    moduleGroups[domainId].forEach((module) => {
      if (!user.data.entries[domainId][module.id]) user.data.entries[domainId][module.id] = [];
    });
  });
  if (!user.profile) user.profile = {};
  if (!user.settings) user.settings = {};
  if (!user.username) user.username = user.email?.split("@")[0] || user.id;
  if (!user.email) user.email = `${user.username}@lifeos.local`;
  if (!user.avatar) user.avatar = defaultAvatar(user.name || user.username);
}

function defaultHabits() {
  return [
    { id: id(), name: "شرب المياه", domain: "health", color: "#2b9be8", days: [true, true, true, true, true, false, false] },
    { id: id(), name: "النوم المنتظم", domain: "health", color: "#28a765", days: [true, true, true, true, true, true, false] },
    { id: id(), name: "تمرين رياضي", domain: "health", color: "#ea8a00", days: [true, true, true, false, false, false, false] },
    { id: id(), name: "المذاكرة", domain: "learning", color: "#5b42c5", days: [true, true, true, true, true, true, false] },
    { id: id(), name: "المراجعة اليومية", domain: "meaning", color: "#2b9be8", days: [true, true, true, true, true, true, true] }
  ];
}

function seedDemoData(user) {
  const date = todayISO();
  const entry = (domain, moduleId, values, daysAgo = 0) => {
    const d = new Date();
    d.setDate(d.getDate() - daysAgo);
    const day = d.toISOString().slice(0, 10);
    user.data.entries[domain][moduleId].push({
      id: id(),
      date: day,
      createdAt: new Date(`${day}T09:00:00`).toISOString(),
      values
    });
  };

  entry("health", "nutrition", { meal: "اليوم كامل", calories: 1650, protein: 92, carbs: 170, fat: 48, fiber: 24 });
  entry("health", "drinks", { water: 1.2, coffee: 1, tea: 2, soda: 0, juice: 0 });
  entry("health", "movement", { steps: 6245, walkingMinutes: 45, runningMinutes: 0, swimmingMinutes: 0, cyclingMinutes: 0 });
  entry("health", "sleep", { hours: 7.2, quality: "جيد", bedTime: "23:30", wakeTime: "07:00" });
  entry("health", "gym", { workout: "Upper Body", targetMuscles: "صدر وظهر", resistanceMinutes: 45, cardioMinutes: 10, intensity: "متوسط" });
  entry("health", "body", { weight: 84.2, height: 176, waist: 91, bodyFat: 24 });
  entry("health", "medicine", { name: "Vitamin D", dose: "1000 IU", time: "21:00", duration: "30 يوم", status: "مستحق", warnings: "بعد الأكل" });
  entry("health", "labs", { testName: "CBC", result: "طبيعي", unit: "", normalRange: "داخل المعدل", doctorNote: "إعادة بعد 3 شهور" }, 3);

  entry("learning", "dailyStudy", { focusHours: 2.5, pomodoro: 4, todoDone: 3, blocker: "تشتت بسيط" });
  entry("learning", "courses", { course: "Data Science", field: "Programming", progress: 60, hours: 1.5, nextLesson: "Pandas" });
  entry("learning", "language", { language: "English", level: "A2", newWords: 20, speaking: 15, listening: 25, writing: 10 });
  entry("learning", "reading", { title: "Atomic Habits", type: "كتاب", pages: 20, summary: "البيئة تصنع السلوك" });
  entry("learning", "skills", { skill: "SQL", progress: 60, level: "Intermediate", practiceHours: 1, evidence: "Queries على مشروع" });
  entry("learning", "projects", { project: "Life OS", type: "Portfolio", progress: 45, status: "جاري", nextStep: "تحسين التقارير" });

  entry("finance", "income", { source: "مرتب", amount: 8500, type: "مرتب", expected: "نعم" });
  entry("finance", "expenses", { category: "أكل", amount: 6200, payment: "كارت", notes: "مصروف الشهر حتى الآن" });
  entry("finance", "debts", { debtName: "قسط", remaining: 1200, installment: 400, dueDate: date, status: "مستحق" });
  entry("finance", "savings", { saved: 2300, goal: 10000, purpose: "Emergency fund", monthlyTarget: 2500 });
  entry("finance", "investments", { asset: "ذهب", value: 5000, cost: 4700, notes: "استثمار طويل" });
  entry("finance", "freelance", { client: "عميل جديد", offer: "Dashboard", amount: 3000, status: "مرسل", rating: 0 });
  entry("finance", "jobSearch", { company: "Company A", role: "Data Analyst", cvVersion: "v2", status: "Applied", nextAction: "Follow up" });
  entry("finance", "incomeStreams", { source: "مرتب أساسي", streamType: "مرتب ثابت", frequency: "شهري", amount: 8500, stability: 9, growthPlan: "التفاوض بعد تحسين KPIs" });
  entry("finance", "incomeStreams", { source: "Dashboard Freelance", streamType: "فريلانس", frequency: "متقطع", amount: 3000, stability: 4, growthPlan: "إرسال 10 عروض شهريا" });
  entry("finance", "expenseAnalysis", { category: "أكل", subcategory: "طلبات خارجية", necessity: "تسريب مالي", amount: 1200, reason: "عدم تجهيز وجبات", cutPlan: "تحضير وجبتين في الأسبوع" });
  entry("finance", "emergencyFund", { current: 2300, monthlyNeed: 6000, targetMonths: 3, monthlyContribution: 1500, location: "حساب بنكي", rules: "يستخدم فقط للصحة أو فقدان الدخل" });
  entry("finance", "cashflowPlan", { month: date.slice(0, 7), openingBalance: 1800, expectedIncome: 11500, fixedExpenses: 5200, variableBudget: 3600, riskNote: "تقليل الطلبات الخارجية" });
  entry("finance", "financialGoals", { goal: "صندوق طوارئ 3 شهور", targetAmount: 18000, currentAmount: 2300, deadline: date, priority: "حرجة", plan: "تحويل تلقائي أول الشهر" });
  entry("finance", "workTypes", { workType: "هجين", workplace: "الشركة الحالية", contract: "موظف", hours: 8, incomePotential: 7, notes: "مناسب حاليا مع تطوير مهارات البيانات" });
  entry("finance", "jobLinks", { company: "Data Co", role: "Junior Data Analyst", url: "https://example.com/job", source: "LinkedIn", deadline: date, status: "تم التقديم", notes: "محتاج متابعة بعد أسبوع" });
  entry("finance", "careerPlans", { targetRole: "Data Analyst", skillGap: "Power BI + SQL advanced", timeline: "6 شهور", salaryTarget: 18000, nextMilestone: "مشروع Portfolio", risk: "التشتت بين كورسات كثيرة" });
  entry("finance", "workTasks", { task: "تحديث CV", project: "Job Search", priority: "عالية", dueDate: date, status: "قيد التنفيذ", attachment: null, notes: "نسخة مخصصة للبيانات" });
  entry("finance", "freelancePipeline", { platform: "Mostaql", client: "عميل محتمل", project: "تحليل مبيعات", stage: "Proposal", price: 5000, deadline: date, attachment: null, notes: "إرسال عرض واضح" });
  entry("finance", "requiredFiles", { fileTitle: "CV Data Analyst", purpose: "CV", version: "v1", attachment: null, expiry: date, notes: "يحتاج تحديث المشاريع" });

  entry("relationships", "mood", { mood: 7, stress: 4, anger: 2, satisfaction: 7, trigger: "يوم مزدحم لكن جيد" });
  entry("relationships", "family", { person: "الأسرة", contactType: "مكالمة", quality: 8, responsibility: "متابعة أسبوعية" });
  entry("relationships", "friends", { friend: "صديق قريب", contactType: "رسالة", relationshipStrength: 7, nextFollowup: date });
  entry("relationships", "conflicts", { person: "زميل", reason: "اختلاف على ميعاد تسليم", solution: "تحديد اتفاق واضح", status: "قيد الحل" });
  entry("relationships", "gratitude", { thing: "مكالمة داعمة", person: "صديق", feeling: "امتنان وهدوء" });

  entry("meaning", "worship", { prayers: 5, quranPages: 2, dhikr: 40, dua: "الثبات", fasting: "لا" });
  entry("meaning", "values", { value: "الصبر", score: 7, evidence: "اتعاملت بهدوء مع ضغط اليوم" });
  entry("meaning", "personalGoal", { goal: "توازن صحي ومهني", why: "علشان أعيش بوعي واستقلال", progress: 55, nextStep: "مراجعة أسبوعية" });
  entry("meaning", "giving", { type: "مساعدة", amount: "30 دقيقة", person: "زميل", note: "شرح بسيط" });
  entry("meaning", "reflection", { type: "يومية", right: "خلصت أهم مهمة", change: "أنام أبكر", lesson: "ابدأ بالأهم" });

  user.data.tasks = [
    { id: id(), title: "تمرين أو مشي 30 دقيقة", domain: "health", importance: "high", urgency: "later", due: "", status: "todo", createdAt: nowISO() },
    { id: id(), title: "أخذ الدواء الساعة 9 مساء", domain: "health", importance: "high", urgency: "urgent", due: "21:00", status: "todo", createdAt: nowISO() },
    { id: id(), title: "مذاكرة English ساعة", domain: "learning", importance: "high", urgency: "later", due: "", status: "doing", createdAt: nowISO() },
    { id: id(), title: "تسجيل المصاريف", domain: "finance", importance: "high", urgency: "urgent", due: "", status: "todo", createdAt: nowISO() },
    { id: id(), title: "التواصل مع شخص مهم", domain: "relationships", importance: "high", urgency: "later", due: "", status: "doing", createdAt: nowISO() },
    { id: id(), title: "مراجعة يومية قبل النوم", domain: "meaning", importance: "high", urgency: "later", due: "23:00", status: "done", createdAt: nowISO() },
    { id: id(), title: "سوشيال ميديا بدون هدف", domain: "priorities", importance: "low", urgency: "later", due: "", status: "todo", createdAt: nowISO() }
  ];
}

function switchAuthTab(tab) {
  document.querySelectorAll("[data-auth-tab]").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.authTab === tab);
  });
  elements.loginForm.classList.toggle("hidden", tab !== "login");
  elements.registerForm.classList.toggle("hidden", tab !== "register");
}

function onLogin(event) {
  event.preventDefault();
  const login = document.getElementById("loginEmail").value.toLowerCase().trim();
  const password = document.getElementById("loginPassword").value;
  let user = Object.values(state.db.users).find((item) => {
    return (item.username === login || item.email === login) && item.password === password;
  });
  if (!user) user = getOrCreateSystemUser(login, password);
  if (!user) {
    document.getElementById("loginMessage").textContent = "اسم المستخدم أو كلمة المرور غير صحيحة.";
    return;
  }
  localStorage.setItem(SESSION_KEY, user.id);
  state.page = "home";
  renderAuthOrApp();
  pullFirebaseUser(user.id);
}

function onRegister(event) {
  event.preventDefault();
  const username = document.getElementById("registerName").value.toLowerCase().trim();
  const currentPassword = document.getElementById("registerEmail").value;
  const newPassword = document.getElementById("registerPassword").value;
  let user = Object.values(state.db.users).find((item) => item.username === username);
  if (!user) user = getOrCreateSystemUser(username, currentPassword);
  if (!user || user.password !== currentPassword) {
    document.getElementById("registerMessage").textContent = "اسم المستخدم أو كلمة المرور الحالية غير صحيحة.";
    return;
  }
  user.password = newPassword;
  user.passwordUpdatedAt = nowISO();
  saveDB();
  localStorage.setItem(SESSION_KEY, user.id);
  document.getElementById("registerMessage").textContent = "";
  state.page = "home";
  renderAuthOrApp();
}

function loginDemo() {
  const credential = getSystemCredential(1);
  document.getElementById("loginEmail").value = credential.username;
  document.getElementById("loginPassword").value = credential.password;
  const user = Object.values(state.db.users).find((item) => item.username === credential.username);
  if (user) localStorage.setItem(SESSION_KEY, user.id);
  state.page = "home";
  renderAuthOrApp();
}

function renderAuthOrApp() {
  const user = getCurrentUser();
  if (!user) {
    elements.authScreen.classList.remove("hidden");
    elements.appShell.classList.add("hidden");
    return;
  }
  ensureUserShape(user);
  elements.authScreen.classList.add("hidden");
  elements.appShell.classList.remove("hidden");
  renderNav();
  renderTopbar(user);
  renderPage();
}

function getCurrentUser() {
  const currentId = localStorage.getItem(SESSION_KEY);
  if (!currentId || !state.db.users[currentId]) return null;
  const user = state.db.users[currentId];
  ensureUserShape(user);
  return user;
}

function renderNav() {
  elements.sideNav.innerHTML = navItems.map((item) => `
    <button class="nav-btn ${state.page === item.id ? "is-active" : ""}" data-page="${item.id}" type="button">
      <span>${item.icon}</span>
      <span>${item.label}</span>
    </button>
  `).join("");
}

function renderTopbar(user) {
  elements.topProfileImage.src = user.avatar || defaultAvatar(user.name);
  elements.topUserName.textContent = `مرحبا، ${user.name}`;
  elements.topUserSubtitle.textContent = user.profile?.subtitle || "لديك يوم رائع";
  document.querySelector(".date-pill button").textContent = formatLongDate(new Date());
  const alertCount = getAlerts(user).length;
  document.getElementById("notificationsBtn").setAttribute("data-count", String(alertCount));
  renderSideInsight(user);
}

function renderSideInsight(user) {
  const box = document.querySelector(".side-quote");
  if (!box || !user) return;
  const summaries = getAllDomainSummaries(user);
  const entries = Object.entries(summaries).sort((a, b) => a[1].score - b[1].score);
  const weakest = entries[0];
  const strongest = entries[entries.length - 1];
  const alerts = getAlerts(user).length;
  const icon = alerts >= 5 ? "⚡" : weakest?.[0] === "health" ? "◎" : weakest?.[0] === "finance" ? "◈" : weakest?.[0] === "learning" ? "✺" : "✦";
  const quote = alerts >= 5
    ? "رتب تنبيه واحد الآن، وسيهدأ اليوم كله خطوة."
    : `قوتك اليوم في ${domains[strongest[0]].short}، وخطوتك القادمة في ${domains[weakest[0]].short}.`;
  box.innerHTML = `
    <strong>${escapeHTML(quote)}</strong>
    <span>توليد تلقائي حسب حالة الداشبورد</span>
    <div class="quote-plant">${icon}</div>
  `;
}

function renderPage() {
  renderNav();
  const user = getCurrentUser();
  if (!user) return;
  renderTopbar(user);

  if (state.page === "home") renderHome(user);
  else if (state.page === "priorities") renderPriorities(user);
  else if (state.page === "finance") renderFinancePage(user);
  else if (state.page === "reports") renderReports(user);
  else if (state.page === "settings") renderSettings(user);
  else renderDomainPage(user, state.page);
}

function renderHome(user) {
  const summary = getAllDomainSummaries(user);
  const alerts = getAlerts(user);
  const topTasks = getSortedTasks(user).slice(0, 5);
  const quick = getQuickStats(user);

  elements.content.innerHTML = `
    <div class="page-head">
      <div>
        <h1>Today Overview</h1>
        <p>نظرة موحدة على أهم مؤشرات اليوم في كل أقسام حياتك.</p>
      </div>
      <div class="section-actions">
        <button class="outline-btn" data-open-page="reports" type="button">فتح التخطيط</button>
        <button class="primary-btn" data-quick-task type="button">إضافة مهمة +</button>
      </div>
    </div>

    <div class="overview-grid">
      ${Object.keys(domains).map((domainId) => renderScoreCard(domainId, summary[domainId])).join("")}
    </div>

    <div class="dashboard-grid">
      <section class="panel">
        <div class="panel-header">
          <h2>أهم تنبيهات اليوم</h2>
          <small>${alerts.length} تنبيه</small>
        </div>
        <div class="list">
          ${alerts.length ? alerts.map(renderAlertItem).join("") : renderEmpty("لا توجد تنبيهات حرجة اليوم.")}
        </div>
      </section>

      <section class="panel">
        <div class="panel-header">
          <h2>أهم 5 مهام اليوم</h2>
          <small>${topTasks.filter((task) => task.status === "done").length}/${topTasks.length} مكتملة</small>
        </div>
        <div class="list">
          ${topTasks.length ? topTasks.map(renderTaskItem).join("") : renderEmpty("أضف مهامك اليومية من زر إضافة مهمة.")}
        </div>
      </section>

      <section class="panel">
        <div class="panel-header">
          <h2>نظرة سريعة</h2>
        </div>
        <div class="quick-stats">
          ${quick.map((item) => `
            <div class="quick-stat">
              <b>${escapeHTML(item.value)}</b>
              <span>${escapeHTML(item.label)}</span>
              <i>${item.icon}</i>
            </div>
          `).join("")}
        </div>
      </section>

      <section class="panel wide-panel">
        <div class="panel-header">
          <h2>مصفوفة أيزنهاور للأولويات</h2>
          <button class="ghost-btn" data-open-page="priorities" type="button">فتح الأولويات</button>
        </div>
        ${renderMatrix(user)}
      </section>

      <section class="panel">
        <div class="panel-header">
          <h2>متابعة العادات</h2>
          <small>آخر 7 أيام</small>
        </div>
        ${renderHabits(user)}
      </section>

      ${renderAIBox("home", "تحليل AI للحالة العامة")}
    </div>
  `;
}

function renderScoreCard(domainId, summary) {
  const domain = domains[domainId];
  return `
    <article class="score-card" style="--card-color:${domain.color};--card-soft:${domain.soft};--card-tint:${domain.tint};--card-line:${domain.line};">
      <div class="score-top">
        <div class="score-name">
          <span class="score-icon">${domain.icon}</span>
          <span>${domain.label}</span>
        </div>
        <div>
          <div class="ring" style="--value:${summary.score};--ring-color:${domain.color};">
            <strong>${summary.score}%</strong>
          </div>
          <div class="score-label">${domain.scoreLabel}</div>
        </div>
      </div>
      <div class="metric-row">
        ${summary.metrics.map((metric) => `
          <div class="mini-metric">
            <i>${metric.icon}</i>
            <b>${escapeHTML(metric.value)}</b>
            <span>${escapeHTML(metric.label)}</span>
          </div>
        `).join("")}
      </div>
    </article>
  `;
}

function renderAlertItem(alert) {
  return `
    <div class="list-item">
      <span class="time">${escapeHTML(alert.time || "")}</span>
      <span>${escapeHTML(alert.text)}</span>
      <span class="tag ${alert.domain}">${domains[alert.domain]?.short || "عام"}</span>
    </div>
  `;
}

function renderTaskItem(task) {
  const domain = domains[task.domain] || { short: "أولوية" };
  const statusText = task.status === "done" ? "مكتملة" : task.status === "doing" ? "قيد التنفيذ" : "لم تبدأ";
  return `
    <div class="list-item">
      <button class="task-check ${task.status === "done" ? "is-done" : ""}" data-task-toggle="${task.id}" type="button">✓</button>
      <span>${escapeHTML(task.title)}</span>
      <span class="tag ${task.status}">${statusText}</span>
    </div>
    <div class="tag ${task.domain}" style="width:max-content;margin-right:34px;margin-top:-6px;">${domain.short}</div>
  `;
}

function renderFinancePage(user) {
  const tab = state.financeTab || "money";
  const modules = moduleGroups.finance.filter((module) => module.category === tab);
  const isStats = tab === "stats";
  if (!isStats && !modules.some((module) => module.id === state.module.finance)) {
    state.module.finance = modules[0]?.id || "income";
  }
  const activeModule = modules.find((module) => module.id === state.module.finance) || modules[0];
  const entries = activeModule ? getEntries(user, "finance", activeModule.id) : [];
  const stats = activeModule ? getModuleStats(user, "finance", activeModule) : [];
  const domain = domains.finance;

  elements.content.innerHTML = `
    <div class="page-head">
      <div>
        <h1>المال والعمل</h1>
        <p>قسم متقدم لإدارة الماليات والعمل: مصادر دخل، مصاريف، طوارئ، خطط، وظائف، فريلانس، ملفات، وملاحظات.</p>
      </div>
      <div class="section-actions">
        <button class="outline-btn" data-open-page="reports" type="button">التخطيط</button>
        <button class="primary-btn" data-open-entry="finance:${activeModule?.id || "income"}" type="button">إضافة سجل +</button>
      </div>
    </div>

    <div class="finance-tabs" role="tablist">
      <a class="${tab === "money" ? "is-active" : ""}" href="#financeMoneyPanel" data-finance-tab="money">
        الماليات والتحليل
        <span>دخل، مصاريف، طوارئ، ديون، استثمار</span>
      </a>
      <a class="${tab === "stats" ? "is-active" : ""}" href="#financeStatsPanel" data-finance-tab="stats">
        الإحصائيات المالية
        <span>رسوم بيانية، قراءة مالية، وخطة عمل</span>
      </a>
      <a class="${tab === "work" ? "is-active" : ""}" href="#financeWorkPanel" data-finance-tab="work">
        العمل والوظائف
        <span>وظائف، فريلانس، تاسكات، روابط، ملفات</span>
      </a>
    </div>

    ${tab === "money" ? `${renderMoneyDashboard(user)}<div class="finance-secondary-work">${renderWorkDashboard(user)}</div>` : tab === "stats" ? renderFinanceStatsDashboard(user) : renderWorkDashboard(user)}
    ${renderAIBox(`finance-${tab}`, tab === "money" ? "تحليل AI للماليات" : tab === "stats" ? "تحليل AI للإحصائيات المالية" : "تحليل AI للعمل والوظائف")}

    ${isStats ? "" : `<div class="section-layout" style="--domain-color:${domain.color};--domain-soft:${domain.soft};">
      <aside class="subnav">
        ${modules.map((module) => `
          <button class="subnav-btn ${module.id === activeModule.id ? "is-active" : ""}" data-domain="finance" data-module="${module.id}" type="button">
            <b>${module.label}</b>
            <span>${module.desc}</span>
          </button>
        `).join("")}
      </aside>

      <div class="module-area">
        <div class="module-summary">
          ${stats.map((stat) => `
            <div class="summary-card">
              <span>${escapeHTML(stat.label)}</span>
              <strong>${escapeHTML(stat.value)}</strong>
            </div>
          `).join("")}
        </div>

        <section class="panel">
          <div class="panel-header">
            <div>
              <h2>${activeModule.label}</h2>
              <small>${activeModule.desc}</small>
            </div>
            <button class="primary-btn" data-open-entry="finance:${activeModule.id}" type="button">إضافة سجل +</button>
          </div>
          ${renderEntriesTable("finance", activeModule, entries)}
        </section>
      </div>
    </div>`}
  `;
}

function renderMoneyDashboard(user) {
  const finance = getFinanceNumbers(user);
  const expenseBreakdown = getBreakdown(entriesThisMonth(user, "finance", "expenses"), "category", "amount");
  const analysisBreakdown = getBreakdown(entriesThisMonth(user, "finance", "expenseAnalysis"), "necessity", "amount");
  const incomeBreakdown = getBreakdown(entriesThisMonth(user, "finance", "incomeStreams"), "streamType", "amount");
  const budget = getBudgetNumbers(user);
  const emergency = getEmergencyFundNumbers(user);
  const cashflow = getCashflowProjection(user);

  return `
    <div id="financeMoneyPanel" class="finance-dashboard">
      <section class="panel finance-hero">
        <div class="panel-header">
          <h2>لوحة الماليات المتقدمة</h2>
          <small>تحليل الشهر الحالي</small>
        </div>
        <div class="stat-deck">
          <div class="summary-card"><span>الدخل الشهري</span><strong>${formatMoney(finance.income)}</strong></div>
          <div class="summary-card"><span>المصاريف الشهرية</span><strong>${formatMoney(finance.expenses)}</strong></div>
          <div class="summary-card"><span>صافي التدفق</span><strong>${formatMoney(finance.net)}</strong></div>
          <div class="summary-card"><span>نسبة الادخار</span><strong>${finance.savingsRate}%</strong></div>
          <div class="summary-card"><span>الديون المفتوحة</span><strong>${formatMoney(finance.debts)}</strong></div>
          <div class="summary-card"><span>الاستثمارات</span><strong>${formatMoney(finance.investments)}</strong></div>
        </div>
      </section>

      <section class="panel">
        <div class="panel-header">
          <h2>ميزانية وفجوات</h2>
        </div>
        <div class="finance-flow">
          <div class="flow-line"><span>Budget مخطط</span><strong>${formatMoney(budget.planned)}</strong></div>
          <div class="flow-line"><span>مصروف فعلي</span><strong>${formatMoney(budget.spent)}</strong></div>
          <div class="flow-line"><span>فائض/عجز الميزانية</span><strong>${formatMoney(budget.remaining)}</strong></div>
          <div class="flow-line"><span>توقع نهاية الشهر</span><strong>${formatMoney(cashflow.projectedNet)}</strong></div>
        </div>
      </section>

      <section class="panel">
        <div class="panel-header">
          <h2>صندوق الطوارئ</h2>
        </div>
        <div class="finance-flow">
          <div class="flow-line"><span>المبلغ الحالي</span><strong>${formatMoney(emergency.current)}</strong></div>
          <div class="flow-line"><span>الهدف</span><strong>${formatMoney(emergency.target)}</strong></div>
          <div class="flow-line"><span>التغطية الحالية</span><strong>${emergency.coverageMonths} شهر</strong></div>
          <div class="bar-track"><span class="bar-fill" style="--w:${emergency.progress}%;--bar-color:#39ff88;"></span></div>
        </div>
      </section>

      <section class="panel">
        <div class="panel-header">
          <h2>مصادر الدخل</h2>
        </div>
        ${renderMiniBars(incomeBreakdown, "#18e8ff", "لا توجد مصادر دخل مفصلة بعد.")}
      </section>

      <section class="panel">
        <div class="panel-header">
          <h2>النفقات حسب الفئة</h2>
        </div>
        ${renderMiniBars(expenseBreakdown, "#ff4d8d", "لا توجد مصاريف مصنفة بعد.")}
      </section>

      <section class="panel">
        <div class="panel-header">
          <h2>ضروري أم تسريب مالي؟</h2>
        </div>
        ${renderMiniBars(analysisBreakdown, "#ffe66d", "ابدأ من تحليل النفقات لتظهر هذه القراءة.")}
      </section>

      <section class="panel finance-hero">
        <div class="panel-header">
          <h2>أسعار العملات والذهب</h2>
          <button class="outline-btn" data-refresh-market type="button">${state.market.loading ? "جاري التحديث" : "تحديث API"}</button>
        </div>
        ${renderMarketPanel()}
      </section>
    </div>
    <div class="finance-secondary-stats">
      ${renderFinanceStatsDashboard(user)}
    </div>
  `;
}

function legacyRenderFinanceStatsDashboard(user) {
  const finance = getFinanceNumbers(user);
  const budget = getBudgetNumbers(user);
  const emergency = getEmergencyFundNumbers(user);
  const cashflow = getCashflowProjection(user);
  const expenses = getBreakdown(entriesThisMonth(user, "finance", "expenses"), "category", "amount");
  const incomeStreams = getBreakdown(entriesThisMonth(user, "finance", "incomeStreams"), "streamType", "amount");
  const leakage = getBreakdown(entriesThisMonth(user, "finance", "expenseAnalysis"), "necessity", "amount");
  const actionPlan = buildFinanceActionPlan(finance, budget, emergency, cashflow);

  return `
    <div id="financeStatsPanel" class="finance-dashboard finance-stats-dashboard">
      <section class="panel finance-hero">
        <div class="panel-header">
          <h2>الإحصائيات المالية فقط</h2>
          <small>قراءة رقمية ورسوم تخطيطية وخطة عمل</small>
        </div>
        <div class="stat-deck">
          <div class="summary-card"><span>الدخل</span><strong>${formatMoney(finance.income)}</strong></div>
          <div class="summary-card"><span>المصاريف</span><strong>${formatMoney(finance.expenses)}</strong></div>
          <div class="summary-card"><span>الصافي</span><strong>${formatMoney(finance.net)}</strong></div>
          <div class="summary-card"><span>نسبة الادخار</span><strong>${finance.savingsRate}%</strong></div>
          <div class="summary-card"><span>فجوة الميزانية</span><strong>${formatMoney(budget.remaining)}</strong></div>
          <div class="summary-card"><span>توقع التدفق</span><strong>${formatMoney(cashflow.projectedNet)}</strong></div>
        </div>
      </section>

      <section class="panel">
        <div class="panel-header"><h2>الدخل حسب النوع</h2></div>
        ${renderMiniBars(incomeStreams, "#18e8ff", "لا توجد مصادر دخل مفصلة بعد.")}
      </section>

      <section class="panel">
        <div class="panel-header"><h2>المصاريف حسب الفئة</h2></div>
        ${renderMiniBars(expenses, "#ff4d8d", "لا توجد مصاريف مفصلة بعد.")}
      </section>

      <section class="panel">
        <div class="panel-header"><h2>ضروري / كمالي / تسريب</h2></div>
        ${renderMiniBars(leakage, "#ffe66d", "استخدم تحليل النفقات لتظهر هذه الرسوم.")}
      </section>

      <section class="panel">
        <div class="panel-header"><h2>مؤشر الطوارئ</h2></div>
        <div class="finance-flow">
          <div class="flow-line"><span>التغطية الحالية</span><strong>${emergency.coverageMonths} شهر</strong></div>
          <div class="flow-line"><span>الهدف</span><strong>${emergency.targetMonths} شهور</strong></div>
          <div class="bar-track"><span class="bar-fill" style="--w:${emergency.progress}%;--bar-color:#39ff88;"></span></div>
        </div>
      </section>

      <section class="panel finance-hero">
        <div class="panel-header"><h2>Action Plan مالي</h2></div>
        <div class="action-plan-list">
          ${actionPlan.map((item, index) => `
            <div class="notification-card">
              <b>${index + 1}. ${escapeHTML(item.title)}</b>
              <span>${escapeHTML(item.detail)}</span>
            </div>
          `).join("")}
        </div>
      </section>
    </div>
  `;
}

function legacyBuildFinanceActionPlan(finance, budget, emergency, cashflow) {
  const plan = [];
  if (finance.expenses > finance.income * 0.8) {
    plan.push({ title: "خفض المصاريف المتغيرة", detail: "راجع أعلى 3 بنود صرف هذا الأسبوع وحدد سقف يومي واضح." });
  } else {
    plan.push({ title: "ثبّت الانضباط الحالي", detail: "المصاريف تحت السيطرة نسبيا، حافظ على التسجيل اليومي." });
  }
  if (emergency.progress < 50) {
    plan.push({ title: "تمويل صندوق الطوارئ", detail: "حوّل مبلغ ثابت أول كل شهر حتى تصل إلى 3 شهور أمان." });
  } else {
    plan.push({ title: "حماية صندوق الطوارئ", detail: "لا تستخدمه إلا للطوارئ الصحية أو فقدان الدخل." });
  }
  if (finance.debts > 0) {
    plan.push({ title: "خطة سداد الديون", detail: "رتب الديون حسب الفائدة أو أصغر رصيد وخصص دفعة إضافية." });
  }
  if (cashflow.projectedNet < 0 || budget.remaining < 0) {
    plan.push({ title: "تصحيح التدفق النقدي", detail: "أجل الكماليات وخفض الاشتراكات قبل نهاية الشهر." });
  } else {
    plan.push({ title: "استثمار الفائض", detail: "قسم الفائض بين ادخار، طوارئ، وتطوير مهني." });
  }
  return plan.slice(0, 4);
}

function renderFinanceStatsDashboard(user) {
  const finance = getFinanceNumbers(user);
  const budget = getBudgetNumbers(user);
  const emergency = getEmergencyFundNumbers(user);
  const cashflow = getCashflowProjection(user);
  const financeLens = getAdvancedFinanceLens(user, finance, budget, emergency, cashflow);
  const actionPlan = buildFinanceActionPlan(finance, budget, emergency, cashflow, financeLens);

  return `
    <div id="financeStatsPanel" class="finance-stats-lab">
      <section class="panel finance-stats-hero">
        <div class="panel-header">
          <div>
            <h2>الإحصائيات المالية المتقدمة</h2>
            <small>تحليل سيولة، ميزانية، دخل، مصاريف، ديون، أصول، مخاطر، وسيناريوهات تنفيذ</small>
          </div>
          <div class="finance-health-pill ${financeLens.healthClass}">
            <b>${financeLens.healthScore}%</b>
            <span>${escapeHTML(financeLens.healthLabel)}</span>
          </div>
        </div>

        <div class="finance-command-grid">
          ${renderFinanceCommandCard("الدخل الشهري", formatMoney(finance.income), "دخل فعلي", financeLens.incomeTrend, "#39ff88")}
          ${renderFinanceCommandCard("المصاريف", formatMoney(finance.expenses), `${financeLens.expenseRatio}% من الدخل`, financeLens.expenseRatio <= 70 ? "تحت السيطرة" : "ضغط مالي", "#ff4d8d")}
          ${renderFinanceCommandCard("صافي التدفق", formatMoney(finance.net), finance.net >= 0 ? "فائض" : "عجز", finance.net >= 0 ? "قابل للاستثمار" : "يحتاج تدخل", "#18e8ff")}
          ${renderFinanceCommandCard("نسبة الادخار", `${finance.savingsRate}%`, `هدفك ${user.settings.savingsTargetRate || 20}%`, finance.savingsRate >= (user.settings.savingsTargetRate || 20) ? "محقق" : "أقل من الهدف", "#ffe66d")}
          ${renderFinanceCommandCard("عبء الديون", `${financeLens.debtRatio}%`, formatMoney(finance.debts), financeLens.debtRatio <= 35 ? "آمن نسبيا" : "مرتفع", "#b16cff")}
          ${renderFinanceCommandCard("Runway", `${financeLens.runwayMonths} شهر`, "سيولة / معدل الحرق", financeLens.runwayMonths >= 3 ? "مطمئن" : "قصير", "#7df3ff")}
        </div>
      </section>

      <section class="panel finance-chart-panel">
        <div class="panel-header">
          <h2>خريطة التدفق النقدي</h2>
          <small>من الدخل إلى الصافي بعد المصروفات والالتزامات</small>
        </div>
        ${renderFinanceWaterfall(financeLens.waterfall)}
      </section>

      <section class="panel finance-chart-panel">
        <div class="panel-header">
          <h2>توزيع المصاريف</h2>
          <small>دائرة نسبية حسب الفئات الأعلى إنفاقا</small>
        </div>
        ${renderFinanceDonut(financeLens.expenses, "مصاريف", "#ff4d8d")}
      </section>

      <section class="panel finance-chart-panel">
        <div class="panel-header">
          <h2>مصادر الدخل</h2>
          <small>تنوع الدخل وثباته حسب المصدر</small>
        </div>
        ${renderFinanceDonut(financeLens.incomeStreams, "دخل", "#39ff88")}
      </section>

      <section class="panel finance-wide-panel">
        <div class="panel-header">
          <h2>Trend آخر 6 شهور</h2>
          <small>دخل / مصاريف / صافي، مع قراءة اتجاه عامة</small>
        </div>
        ${renderFinanceTrendChart(financeLens.monthlyTrend)}
      </section>

      <section class="panel finance-chart-panel">
        <div class="panel-header">
          <h2>Budget Control</h2>
          <small>المخطط مقابل المصروف والفجوة المتبقية</small>
        </div>
        ${renderFinanceBudgetControl(budget, financeLens)}
      </section>

      <section class="panel finance-chart-panel">
        <div class="panel-header">
          <h2>مؤشر الطوارئ والسيولة</h2>
          <small>تغطية شهرية وفجوة صندوق الطوارئ</small>
        </div>
        ${renderFinanceGauge("الطوارئ", emergency.progress, `${emergency.coverageMonths} شهر`, "#39ff88")}
        <div class="finance-insight-list">
          <span>الاحتياج الشهري: <b>${formatMoney(emergency.monthlyNeed)}</b></span>
          <span>الفجوة حتى الهدف: <b>${formatMoney(financeLens.emergencyGap)}</b></span>
          <span>مساهمة مقترحة: <b>${formatMoney(financeLens.suggestedEmergencyContribution)}</b></span>
        </div>
      </section>

      <section class="panel finance-chart-panel">
        <div class="panel-header">
          <h2>تحليل الأصول والالتزامات</h2>
          <small>ادخار، طوارئ، استثمار، ديون، وصافي ثروة تقريبي</small>
        </div>
        ${renderFinanceAssetStack(financeLens)}
      </section>

      <section class="panel finance-wide-panel">
        <div class="panel-header">
          <h2>مصفوفة المخاطر المالية</h2>
          <small>قراءة عملية لنقاط الضغط التي تحتاج متابعة</small>
        </div>
        ${renderFinanceRiskMatrix(financeLens.risks)}
      </section>

      <section class="panel finance-wide-panel">
        <div class="panel-header">
          <h2>سيناريوهات الشهر</h2>
          <small>Baseline / ضغط / تقشف / نمو لمساعدة القرار قبل نهاية الشهر</small>
        </div>
        ${renderFinanceScenarioTable(financeLens.scenarios)}
      </section>

      <section class="panel finance-chart-panel">
        <div class="panel-header">
          <h2>ضروري / كمالي / تسريب</h2>
          <small>فلترة النفقات حسب طبيعتها</small>
        </div>
        ${renderAdvancedBars(financeLens.leakage, "#ffe66d", "لا توجد بيانات تحليل نفقات بعد.")}
      </section>

      <section class="panel finance-chart-panel">
        <div class="panel-header">
          <h2>أعلى بنود المصروفات</h2>
          <small>الأكثر تأثيرا على الميزانية</small>
        </div>
        ${renderAdvancedBars(financeLens.expenses, "#ff4d8d", "لا توجد مصروفات مفصلة بعد.")}
      </section>

      <section class="panel finance-wide-panel">
        <div class="panel-header">
          <h2>Action Plan مالي تفصيلي</h2>
          <small>خطوات تنفيذية بأولوية وتأثير وقياس متابعة</small>
        </div>
        <div class="finance-action-grid">
          ${actionPlan.map((item, index) => `
            <article class="finance-action-card priority-${escapeAttr(item.priority)}">
              <div class="action-index">${index + 1}</div>
              <div>
                <b>${escapeHTML(item.title)}</b>
                <p>${escapeHTML(item.detail)}</p>
                <div class="action-meta">
                  <span>الأولوية: ${escapeHTML(item.priorityLabel)}</span>
                  <span>المدة: ${escapeHTML(item.time)}</span>
                  <span>المؤشر: ${escapeHTML(item.metric)}</span>
                </div>
              </div>
            </article>
          `).join("")}
        </div>
      </section>
    </div>
  `;
}

function buildFinanceActionPlan(finance, budget, emergency, cashflow, lens = null) {
  const data = lens || getAdvancedFinanceLens(getCurrentUser(), finance, budget, emergency, cashflow);
  const plan = [];
  const add = (priority, title, detail, time, metric) => {
    const labels = { high: "حرجة", medium: "مهمة", low: "تحسين" };
    plan.push({ priority, priorityLabel: labels[priority] || priority, title, detail, time, metric });
  };

  if (data.expenseRatio >= 90) {
    add("high", "تجميد نزيف المصروفات", "أوقف أي إنفاق كمالي 7 أيام وراجع أعلى 3 بنود صرف يوميا حتى ينخفض معدل المصروفات تحت 75% من الدخل.", "7 أيام", "Expense / Income");
  } else if (data.expenseRatio >= 75) {
    add("medium", "خفض المتغيرات", "حدد سقفا أسبوعيا للمواصلات والطلبات والاشتراكات، وانقل الفرق مباشرة لصندوق الطوارئ.", "14 يوم", "Variable spend");
  } else {
    add("low", "تثبيت الانضباط", "استمر في التسجيل اليومي وخصص يوم مراجعة أسبوعي قبل أي قرار شراء كبير.", "أسبوعي", "Daily logging");
  }

  if (emergency.progress < 35) {
    add("high", "بناء صندوق طوارئ عاجل", `الفجوة الحالية ${formatMoney(data.emergencyGap)}. ابدأ بتحويل ${formatMoney(data.suggestedEmergencyContribution)} أول كل شهر قبل أي مصروف اختياري.`, "3 شهور", "Emergency coverage");
  } else if (emergency.progress < 80) {
    add("medium", "تسريع الطوارئ", "ارفع التحويل الشهري لصندوق الطوارئ من أي فائض أو دخل إضافي حتى تصل لتغطية 3 شهور.", "2-4 شهور", "Emergency %");
  } else {
    add("low", "حماية صندوق الطوارئ", "افصل الطوارئ عن الحساب اليومي، ولا تستخدمه إلا للصحة أو فقدان الدخل أو التزام قهري.", "دائم", "Emergency rules");
  }

  if (data.debtRatio > 60 || finance.debts > finance.income * 2) {
    add("high", "خطة ديون هجومية", "رتب الديون حسب الفائدة أو الاستحقاق، واجعل أي دخل إضافي يذهب للدين الأعلى خطرا قبل الاستثمار.", "30 يوم", "Debt ratio");
  } else if (finance.debts > 0) {
    add("medium", "جدولة الديون", "ثبت القسط، وأضف دفعة صغيرة متكررة، وراقب أقرب تاريخ استحقاق في التنبيهات.", "شهري", "Open debts");
  }

  if (budget.remaining < 0 || cashflow.projectedNet < 0) {
    add("high", "تصحيح عجز الميزانية", "أعد توزيع الميزانية: قلل بندين كماليين، وأجل مشتريات غير ضرورية حتى يعود الصافي موجب.", "48 ساعة", "Budget gap");
  } else {
    add("low", "استثمار الفائض", "قسم الفائض بنسبة واضحة: طوارئ، ادخار هدف قريب، واستثمار طويل المدى أو تطوير مهني.", "شهري", "Surplus allocation");
  }

  if (data.incomeStreams.length <= 1) {
    add("medium", "تنويع الدخل", "أضف مصدر دخل واحد قابل للتكرار: فريلانس صغير، عمولة، منتج رقمي، أو مشروع جانبي مرتبط بمهاراتك.", "30-60 يوم", "Income streams");
  }

  add("low", "إكمال البيانات المالية", "سجل مصادر الدخل، فئات المصروفات، الميزانية، والديون مرة واحدة على الأقل حتى تصبح الرسوم أدق.", "اليوم", "Data coverage");
  add("low", "مراجعة مالية أسبوعية", "خصص 20 دقيقة كل أسبوع لمراجعة الجرافات وتحديث خطة الصرف قبل تراكم القرارات الصغيرة.", "أسبوعي", "Review streak");

  return plan.slice(0, 6);
}

function getAdvancedFinanceLens(user, finance, budget, emergency, cashflow) {
  const dayOfMonth = new Date().getDate();
  const monthlyTrend = getMonthlyFinanceTrend(user, 6);
  const expenses = mergeBreakdowns(
    getBreakdown(entriesThisMonth(user, "finance", "expenses"), "category", "amount"),
    getBreakdown(entriesThisMonth(user, "finance", "bills"), "bill", "amount"),
    getBreakdown(entriesThisMonth(user, "finance", "expenseAnalysis"), "category", "amount")
  );
  const incomeStreams = getBreakdown(entriesThisMonth(user, "finance", "incomeStreams"), "streamType", "amount");
  const leakage = getBreakdown(entriesThisMonth(user, "finance", "expenseAnalysis"), "necessity", "amount");
  const debtInstallments = getEntries(user, "finance", "debts")
    .filter((entry) => entry.values.status !== "تم السداد")
    .reduce((total, entry) => total + toNumber(entry.values.installment), 0);
  const assets = finance.savings + finance.emergency + finance.investments;
  const netWorth = assets - finance.debts;
  const expenseRatio = finance.income ? Math.round((finance.expenses / finance.income) * 100) : 0;
  const debtRatio = finance.income ? Math.round((finance.debts / finance.income) * 100) : 0;
  const dailyBurn = dayOfMonth ? finance.expenses / dayOfMonth : finance.expenses;
  const runwayMonths = dailyBurn ? Number(((finance.savings + finance.emergency) / (dailyBurn * 30)).toFixed(1)) : 0;
  const emergencyGap = Math.max(emergency.target - emergency.current, 0);
  const suggestedEmergencyContribution = emergencyGap ? Math.ceil(emergencyGap / Math.max(emergency.targetMonths || 3, 1)) : 0;
  const healthScore = average([
    clamp(100 - expenseRatio),
    clamp(finance.savingsRate * 4),
    emergency.progress,
    clamp(100 - debtRatio),
    finance.net >= 0 ? 90 : 20
  ]);
  const healthLabel = healthScore >= 75 ? "مستقر وقابل للنمو" : healthScore >= 50 ? "متوسط ويحتاج ضبط" : "ضغط مالي عالي";
  const healthClass = healthScore >= 75 ? "good" : healthScore >= 50 ? "watch" : "danger";
  const fixedExpenses = sumField(entriesThisMonth(user, "finance", "bills"), "amount") + debtInstallments;
  const variableExpenses = Math.max(finance.expenses - fixedExpenses, 0);
  const waterfall = [
    { label: "دخل", value: finance.income, type: "positive" },
    { label: "ثابت", value: -fixedExpenses, type: "negative" },
    { label: "متغير", value: -variableExpenses, type: "negative" },
    { label: "ادخار", value: -Math.max(finance.savings + finance.emergency, 0), type: "saving" },
    { label: "صافي", value: finance.net, type: finance.net >= 0 ? "positive" : "negative" }
  ];
  const scenarios = buildFinanceScenarios(finance, budget, cashflow);
  const risks = buildFinanceRisks(finance, budget, emergency, { expenseRatio, debtRatio, runwayMonths, cashflow });
  const last = monthlyTrend[monthlyTrend.length - 1] || {};
  const first = monthlyTrend[0] || {};
  const incomeTrend = (last.income || 0) >= (first.income || 0) ? "صاعد" : "هابط";

  return {
    expenses,
    incomeStreams,
    leakage,
    monthlyTrend,
    debtInstallments,
    assets,
    netWorth,
    expenseRatio,
    debtRatio,
    dailyBurn,
    runwayMonths,
    emergencyGap,
    suggestedEmergencyContribution,
    healthScore,
    healthLabel,
    healthClass,
    fixedExpenses,
    variableExpenses,
    waterfall,
    scenarios,
    risks,
    incomeTrend,
    debts: finance.debts
  };
}

function mergeBreakdowns(...groups) {
  const map = new Map();
  groups.flat().forEach((item) => {
    map.set(item.label, (map.get(item.label) || 0) + item.value);
  });
  return Array.from(map, ([label, value]) => ({ label, value })).sort((a, b) => b.value - a.value);
}

function getMonthlyFinanceTrend(user, months = 6) {
  const result = [];
  const base = new Date(`${todayISO().slice(0, 7)}-01T00:00:00`);
  for (let index = months - 1; index >= 0; index -= 1) {
    const date = new Date(base);
    date.setMonth(base.getMonth() - index);
    const key = date.toISOString().slice(0, 7);
    const income = sumFinanceMonth(user, key, [["income", "amount"], ["incomeStreams", "amount"]]);
    const expenses = sumFinanceMonth(user, key, [["expenses", "amount"], ["bills", "amount"], ["expenseAnalysis", "amount"]]);
    result.push({
      key,
      label: new Intl.DateTimeFormat("ar-EG", { month: "short" }).format(date),
      income,
      expenses,
      net: income - expenses
    });
  }
  return result;
}

function sumFinanceMonth(user, monthKey, pairs) {
  return pairs.reduce((total, [moduleId, field]) => {
    return total + getEntries(user, "finance", moduleId)
      .filter((entry) => entry.date?.startsWith(monthKey))
      .reduce((sum, entry) => sum + toNumber(entry.values[field]), 0);
  }, 0);
}

function buildFinanceScenarios(finance, budget, cashflow) {
  const baseIncome = finance.income || cashflow.projectedNet + finance.expenses;
  return [
    { name: "Baseline", income: baseIncome, expenses: finance.expenses, note: "الوضع الحالي بدون تغيير" },
    { name: "ضغط دخل -15%", income: baseIncome * 0.85, expenses: finance.expenses, note: "اختبار تحمل انخفاض الدخل" },
    { name: "مصاريف +15%", income: baseIncome, expenses: finance.expenses * 1.15, note: "اختبار زيادة مفاجئة" },
    { name: "تقشف -20%", income: baseIncome, expenses: finance.expenses * 0.8, note: "خطة إنقاذ قصيرة" },
    { name: "نمو +10%", income: baseIncome * 1.1, expenses: finance.expenses, note: "دخل إضافي أو فريلانس" }
  ].map((item) => ({ ...item, net: item.income - item.expenses, budgetGap: budget.planned ? budget.planned - item.expenses : item.income - item.expenses }));
}

function buildFinanceRisks(finance, budget, emergency, data) {
  return [
    {
      title: "ضغط المصاريف",
      level: data.expenseRatio >= 85 ? "عالي" : data.expenseRatio >= 70 ? "متوسط" : "منخفض",
      value: `${data.expenseRatio}%`,
      detail: "نسبة المصاريف إلى الدخل الشهري."
    },
    {
      title: "الديون",
      level: data.debtRatio >= 80 ? "عالي" : data.debtRatio >= 35 ? "متوسط" : "منخفض",
      value: `${data.debtRatio}%`,
      detail: "إجمالي الديون المفتوحة مقارنة بالدخل."
    },
    {
      title: "الطوارئ",
      level: emergency.progress < 35 ? "عالي" : emergency.progress < 75 ? "متوسط" : "منخفض",
      value: `${emergency.progress}%`,
      detail: "نسبة اكتمال صندوق الطوارئ."
    },
    {
      title: "فجوة الميزانية",
      level: budget.remaining < 0 ? "عالي" : budget.remaining < finance.income * 0.1 ? "متوسط" : "منخفض",
      value: formatMoney(budget.remaining),
      detail: "الفرق بين المخطط والمصروف."
    },
    {
      title: "الصافي المتوقع",
      level: data.cashflow.projectedNet < 0 ? "عالي" : data.cashflow.projectedNet < finance.income * 0.1 ? "متوسط" : "منخفض",
      value: formatMoney(data.cashflow.projectedNet),
      detail: "توقع نهاية الشهر من خطة التدفق."
    },
    {
      title: "Runway",
      level: data.runwayMonths < 1 ? "عالي" : data.runwayMonths < 3 ? "متوسط" : "منخفض",
      value: `${data.runwayMonths} شهر`,
      detail: "مدة استمرار السيولة الحالية مع نفس معدل الحرق."
    }
  ];
}

function renderFinanceCommandCard(label, value, caption, signal, color) {
  return `
    <div class="finance-command-card" style="--accent:${color};">
      <span>${escapeHTML(label)}</span>
      <strong>${escapeHTML(value)}</strong>
      <small>${escapeHTML(caption)}</small>
      <em>${escapeHTML(signal)}</em>
    </div>
  `;
}

function renderFinanceWaterfall(items) {
  const max = Math.max(...items.map((item) => Math.abs(item.value)), 1);
  return `
    <div class="waterfall-chart">
      ${items.map((item) => `
        <div class="waterfall-item ${item.type}">
          <div class="waterfall-column" style="--h:${Math.max(12, Math.round((Math.abs(item.value) / max) * 100))}%;">
            <span>${formatMoney(Math.abs(item.value))}</span>
          </div>
          <b>${escapeHTML(item.label)}</b>
        </div>
      `).join("")}
    </div>
  `;
}

function renderFinanceDonut(items, label, color) {
  if (!items.length) {
    return `
      <div class="donut-layout">
        <div class="donut-chart is-empty" style="--donut:${color} 0% 33%, #18e8ff 33% 66%, #b16cff 66% 100%;">
          <strong>0</strong>
          <span>${escapeHTML(label)}</span>
        </div>
        <div class="donut-legend">
          <div><i style="--legend:${color};"></i><span>أضف بيانات لظهور النسب</span><b>0%</b></div>
          <div><i style="--legend:#18e8ff;"></i><span>سيتم التوزيع تلقائيا</span><b>0%</b></div>
          <div><i style="--legend:#b16cff;"></i><span>الجراف جاهز للبيانات</span><b>0%</b></div>
        </div>
      </div>
    `;
  }
  const total = items.reduce((sum, item) => sum + item.value, 0) || 1;
  let cursor = 0;
  const palette = [color, "#18e8ff", "#ffe66d", "#b16cff", "#39ff88", "#ff8a4d", "#7df3ff", "#ff4d8d"];
  const stops = items.slice(0, 6).map((item, index) => {
    const start = cursor;
    const end = cursor + (item.value / total) * 100;
    cursor = end;
    return `${palette[index % palette.length]} ${start}% ${end}%`;
  }).join(", ");
  return `
    <div class="donut-layout">
      <div class="donut-chart" style="--donut:${stops};">
        <strong>${formatCompact(total)}</strong>
        <span>${escapeHTML(label)}</span>
      </div>
      <div class="donut-legend">
        ${items.slice(0, 6).map((item, index) => `
          <div><i style="--legend:${palette[index % palette.length]};"></i><span>${escapeHTML(item.label)}</span><b>${Math.round((item.value / total) * 100)}%</b></div>
        `).join("")}
      </div>
    </div>
  `;
}

function renderFinanceTrendChart(trend) {
  const max = Math.max(...trend.flatMap((item) => [item.income, item.expenses, Math.abs(item.net)]), 1);
  const makePoints = (field) => trend.map((item, index) => {
    const x = trend.length === 1 ? 50 : (index / (trend.length - 1)) * 100;
    const y = 100 - ((field === "net" ? Math.max(item.net, 0) : item[field]) / max) * 86 - 7;
    return `${x},${clamp(y, 7, 93)}`;
  }).join(" ");
  return `
    <div class="trend-chart">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        <polyline class="income-line" points="${makePoints("income")}"></polyline>
        <polyline class="expense-line" points="${makePoints("expenses")}"></polyline>
        <polyline class="net-line" points="${makePoints("net")}"></polyline>
      </svg>
      <div class="trend-axis">
        ${trend.map((item) => `<span>${escapeHTML(item.label)}</span>`).join("")}
      </div>
      <div class="trend-legend">
        <span class="income-line">دخل</span>
        <span class="expense-line">مصاريف</span>
        <span class="net-line">صافي موجب</span>
      </div>
    </div>
  `;
}

function renderFinanceBudgetControl(budget, lens) {
  const used = budget.planned ? clamp(Math.round((budget.spent / budget.planned) * 100)) : 0;
  return `
    <div class="budget-control">
      ${renderFinanceGauge("استهلاك الميزانية", used, `${used}%`, used > 100 ? "#ff4d8d" : "#18e8ff")}
      <div class="finance-insight-list">
        <span>المخطط: <b>${formatMoney(budget.planned)}</b></span>
        <span>المصروف: <b>${formatMoney(budget.spent)}</b></span>
        <span>الفجوة: <b>${formatMoney(budget.remaining)}</b></span>
        <span>حرق يومي: <b>${formatMoney(lens.dailyBurn)}</b></span>
      </div>
    </div>
  `;
}

function renderFinanceGauge(label, percent, value, color) {
  const safePercent = clamp(Number(percent) || 0);
  return `
    <div class="finance-gauge" style="--gauge:${safePercent}%;--gauge-color:${color};">
      <div>
        <strong>${escapeHTML(value)}</strong>
        <span>${escapeHTML(label)}</span>
      </div>
    </div>
  `;
}

function renderFinanceAssetStack(lens) {
  const total = Math.max(lens.assets + lens.debts, 1);
  const savingsPart = Math.round((lens.assets / total) * 100);
  const debtPart = Math.round((lens.debts / total) * 100);
  return `
    <div class="asset-stack">
      <div class="asset-meter">
        <span style="--w:${clamp(savingsPart)}%;--bar-color:#39ff88;">الأصول</span>
        <span style="--w:${debtPart}%;--bar-color:#ff4d8d;">التزامات</span>
      </div>
      <div class="finance-insight-list">
        <span>الأصول التقريبية: <b>${formatMoney(lens.assets)}</b></span>
        <span>الديون المفتوحة: <b>${formatMoney(lens.debts)}</b></span>
        <span>صافي ثروة تقريبي: <b>${formatMoney(lens.netWorth)}</b></span>
        <span>أقساط مفتوحة: <b>${formatMoney(lens.debtInstallments)}</b></span>
      </div>
    </div>
  `;
}

function renderFinanceRiskMatrix(risks) {
  return `
    <div class="risk-matrix">
      ${risks.map((risk) => `
        <article class="risk-card risk-${risk.level === "عالي" ? "high" : risk.level === "متوسط" ? "medium" : "low"}">
          <span>${escapeHTML(risk.level)}</span>
          <b>${escapeHTML(risk.title)}</b>
          <strong>${escapeHTML(risk.value)}</strong>
          <p>${escapeHTML(risk.detail)}</p>
        </article>
      `).join("")}
    </div>
  `;
}

function renderFinanceScenarioTable(scenarios) {
  return `
    <div class="table-scroll scenario-table">
      <table class="entry-table">
        <thead><tr><th>السيناريو</th><th>الدخل</th><th>المصاريف</th><th>الصافي</th><th>القراءة</th></tr></thead>
        <tbody>
          ${scenarios.map((item) => `
            <tr class="${item.net < 0 ? "danger-row" : "good-row"}">
              <td>${escapeHTML(item.name)}</td>
              <td>${formatMoney(item.income)}</td>
              <td>${formatMoney(item.expenses)}</td>
              <td>${formatMoney(item.net)}</td>
              <td>${escapeHTML(item.note)}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function renderAdvancedBars(items, color, emptyText) {
  if (!items.length) return renderEmpty(emptyText);
  const max = Math.max(...items.map((item) => item.value), 1);
  const total = items.reduce((sum, item) => sum + item.value, 0) || 1;
  return `
    <div class="advanced-bars">
      ${items.slice(0, 8).map((item, index) => `
        <div class="advanced-bar-row">
          <div><b>${index + 1}</b><span>${escapeHTML(item.label)}</span></div>
          <div class="bar-track"><span class="bar-fill" style="--w:${Math.round((item.value / max) * 100)}%;--bar-color:${color};"></span></div>
          <strong>${formatMoney(item.value)}</strong>
          <em>${Math.round((item.value / total) * 100)}%</em>
        </div>
      `).join("")}
    </div>
  `;
}

function renderWorkDashboard(user) {
  const work = getWorkNumbers(user);
  const jobStatus = getBreakdown(getEntries(user, "finance", "jobLinks"), "status", null);
  const freelanceStages = getBreakdown(getEntries(user, "finance", "freelancePipeline"), "stage", "price");
  const workTypes = getBreakdown(getEntries(user, "finance", "workTypes"), "workType", null);
  const upcomingTasks = getEntries(user, "finance", "workTasks")
    .filter((entry) => entry.values.status !== "مكتملة")
    .slice()
    .sort(sortNewest)
    .slice(0, 5);

  return `
    <div id="financeWorkPanel" class="finance-dashboard">
      <section class="panel finance-hero">
        <div class="panel-header">
          <h2>لوحة العمل والوظائف</h2>
          <small>Pipeline مهني متصل</small>
        </div>
        <div class="stat-deck">
          <div class="summary-card"><span>روابط وظائف</span><strong>${work.jobLinks}</strong></div>
          <div class="summary-card"><span>تقديمات نشطة</span><strong>${work.activeApplications}</strong></div>
          <div class="summary-card"><span>مشاريع فريلانس</span><strong>${work.freelanceProjects}</strong></div>
          <div class="summary-card"><span>قيمة الفريلانس</span><strong>${formatMoney(work.freelanceValue)}</strong></div>
          <div class="summary-card"><span>تاسكات مفتوحة</span><strong>${work.openTasks}</strong></div>
          <div class="summary-card"><span>ملفات محفوظة</span><strong>${work.files}</strong></div>
        </div>
      </section>

      <section class="panel">
        <div class="panel-header">
          <h2>حالات الوظائف</h2>
        </div>
        ${renderMiniBars(jobStatus, "#18e8ff", "أضف روابط الوظائف لتظهر هنا.")}
      </section>

      <section class="panel">
        <div class="panel-header">
          <h2>مراحل الفريلانس</h2>
        </div>
        ${renderMiniBars(freelanceStages, "#b16cff", "أضف فرص الفريلانس لتظهر هنا.")}
      </section>

      <section class="panel">
        <div class="panel-header">
          <h2>أنواع العمل</h2>
        </div>
        ${renderMiniBars(workTypes, "#39ff88", "سجل أنواع العمل والأماكن أولا.")}
      </section>

      <section class="panel finance-hero">
        <div class="panel-header">
          <h2>تاسكات العمل المفتوحة</h2>
        </div>
        <div class="list">
          ${upcomingTasks.length ? upcomingTasks.map((entry) => `
            <div class="list-item">
              <span class="time">${formatShortDate(entry.values.dueDate || entry.date)}</span>
              <span>${escapeHTML(entry.values.task || "مهمة عمل")}</span>
              <span class="tag finance">${escapeHTML(entry.values.priority || "متوسطة")}</span>
            </div>
          `).join("") : renderEmpty("لا توجد تاسكات عمل مفتوحة.")}
        </div>
      </section>
    </div>
  `;
}

function renderMarketPanel() {
  const data = state.market.data;
  const gold = calculateGoldTools(false);
  const rows = data?.currencies?.length ? data.currencies.map((item) => `
    <tr><td>${item.code}</td><td>${formatNumber(item.egp)} جنيه</td><td>${escapeHTML(item.name)}</td></tr>
  `).join("") : `<tr><td colspan="3">اضغط تحديث API لجلب أسعار العملات مقابل الجنيه.</td></tr>`;
  return `
    <div class="market-grid">
      <div class="table-scroll">
        <table class="entry-table">
          <thead><tr><th>العملة</th><th>سعرها بالجنيه</th><th>الوصف</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
        <small>${data?.updated ? `آخر تحديث: ${escapeHTML(data.updated)}` : "مصدر العملات قابل للتغيير من market-config.js"}</small>
      </div>
      <div class="gold-price-board">
        <div class="summary-card"><span>جرام 24</span><strong>${formatMoney(gold.gram24)}</strong></div>
        <div class="summary-card"><span>جرام 21</span><strong>${formatMoney(gold.gram21)}</strong></div>
        <div class="summary-card"><span>جرام 18</span><strong>${formatMoney(gold.gram18)}</strong></div>
        <div class="summary-card"><span>الجنيه الذهب</span><strong>${formatMoney(gold.goldPound)}</strong></div>
        <div class="summary-card"><span>الأونصة عالميا</span><strong>${data?.goldUsd ? `$${formatNumber(data.goldUsd)}` : "غير متاح"}</strong></div>
      </div>
    </div>
  `;
}

async function loadMarketRates() {
  state.market.loading = true;
  renderPage();
  const config = window.lifeOSMarket || {};
  try {
    const [fiatResponse, goldResponse] = await Promise.all([
      fetch(config.fiatUrl || "https://open.er-api.com/v6/latest/USD"),
      fetch(config.goldUrl || "https://api.gold-api.com/price/XAU")
    ]);
    const fiat = await fiatResponse.json();
    const gold = await goldResponse.json();
    const usdToEgp = toNumber(fiat.rates?.EGP || fiat.conversion_rates?.EGP);
    const currencyNames = {
      USD: "الدولار الأمريكي",
      SAR: "الريال السعودي",
      KWD: "الدينار الكويتي",
      AED: "الدرهم الإماراتي",
      EUR: "اليورو",
      GBP: "الجنيه الإسترليني"
    };
    const codes = config.currencyCodes || ["USD", "SAR", "KWD", "AED", "EUR", "GBP"];
    state.market.data = {
      updated: fiat.time_last_update_utc || new Date().toISOString(),
      usdToEgp,
      goldUsd: toNumber(gold.price || gold.price_gram_24k || gold.ask),
      currencies: codes.map((code) => ({
        code,
        name: currencyNames[code] || code,
        egp: code === "USD" ? usdToEgp : usdToEgp / Math.max(toNumber(fiat.rates?.[code] || fiat.conversion_rates?.[code]), 0.000001)
      }))
    };
    state.market.error = "";
    showToast("تم تحديث أسعار العملات والذهب.");
  } catch (error) {
    console.warn("Market API failed", error);
    state.market.error = "تعذر تحديث الأسعار، سيتم استخدام آخر بيانات محفوظة أو قيم تقديرية.";
    showToast(state.market.error);
  } finally {
    state.market.loading = false;
    renderPage();
  }
}

function calculateGoldTools(readInputs = true) {
  if (readInputs) {
    state.market.goldGrams = toNumber(document.getElementById("goldGramsInput")?.value || state.market.goldGrams);
    state.market.goldKarat = String(document.getElementById("goldKaratInput")?.value || state.market.goldKarat);
    state.market.zakatCash = toNumber(document.getElementById("zakatCashInput")?.value || state.market.zakatCash);
  }
  const config = window.lifeOSMarket || {};
  const usdToEgp = state.market.data?.usdToEgp || 50;
  const goldUsd = state.market.data?.goldUsd || 2400;
  const premium = 1 + toNumber(config.egyptGoldPremiumRate || 0);
  const gram24 = (goldUsd * usdToEgp / 31.1035) * premium;
  const gram21 = gram24 * 0.875;
  const gram18 = gram24 * 0.75;
  const perGram = state.market.goldKarat === "24" ? gram24 : state.market.goldKarat === "18" ? gram18 : gram21;
  const goldValue = state.market.goldGrams * perGram;
  return {
    gram24,
    gram21,
    gram18,
    goldPound: gram21 * 8,
    goldValue,
    goldZakat: goldValue * 0.025,
    moneyZakat: state.market.zakatCash * 0.025
  };
}

function renderMiniBars(items, color, emptyText) {
  if (!items.length) return renderEmpty(emptyText);
  const max = Math.max(...items.map((item) => item.value), 1);
  return `
    <div class="bar-chart mini-bars">
      ${items.slice(0, 8).map((item) => `
        <div class="bar-row">
          <span class="bar-label">${escapeHTML(item.label)}</span>
          <span class="bar-track"><span class="bar-fill" style="--w:${Math.round((item.value / max) * 100)}%;--bar-color:${color};"></span></span>
          <b>${formatNumber(item.value)}</b>
        </div>
      `).join("")}
    </div>
  `;
}

function renderAIBox(section, title) {
  const response = state.market.aiResponses[section] || "اضغط تحليل AI للحصول على قراءة مختصرة وخطة تنفيذية لهذا القسم.";
  return `
    <section class="panel ai-panel">
      <div class="panel-header">
        <div>
          <h2>${escapeHTML(title)}</h2>
          <small>${getAISettings().enabled ? "Gemini API جاهز عند إدخال المفتاح" : "تحليل محلي، ويمكن تفعيل Gemini من ai-config.js"}</small>
        </div>
        <button class="primary-btn" data-ai-section="${escapeAttr(section)}" type="button">تحليل AI</button>
      </div>
      <div class="ai-output">${escapeHTML(response)}</div>
    </section>
  `;
}

function renderLearningBrainHero(user) {
  const progress = getLearningSummary(user).score;
  return `
    <section class="panel brain-hero">
      <div class="brain-visual" style="--brain-progress:${progress};">
        <svg viewBox="0 0 220 180" aria-hidden="true">
          <path class="brain-path" d="M70 142c-28-5-48-28-48-57 0-28 21-51 48-55 9-17 31-25 50-17 16-10 38-6 49 9 21 3 37 21 37 43 0 14-7 27-18 35 2 24-15 44-39 44H70Z"/>
          <path class="brain-line" d="M70 64h34l16-22v74l18-30h40M63 98h40l16 18 22-56 12 38h34"/>
        </svg>
        <strong>${progress}%</strong>
      </div>
      <div>
        <h2>مؤشر نمو العقل والتعلم</h2>
        <p>نسبة التقدم محسوبة من ساعات التعلم، الكورسات، اللغة، القراءة، المهارات والمشاريع.</p>
      </div>
    </section>
  `;
}

function renderZakatCalculators(user) {
  const gold = calculateGoldTools(false);
  return `
    <section class="panel zakat-panel">
      <div class="panel-header">
        <div>
          <h2>حاسبات الزكاة والصدقات</h2>
          <small>زكاة الذهب وزكاة المال ضمن المعنى والروح</small>
        </div>
        <div class="section-actions">
          <button class="outline-btn" data-refresh-market type="button">تحديث سعر الذهب</button>
          <button class="primary-btn" data-calculate-gold type="button">احسب الزكاة</button>
        </div>
      </div>
      <div class="zakat-grid">
        <div class="gold-calculator">
          <label>
            عدد جرامات الذهب
            <input id="goldGramsInput" type="number" step="0.1" value="${state.market.goldGrams}" />
          </label>
          <label>
            العيار
            <select id="goldKaratInput">
              ${["24", "21", "18"].map((karat) => `<option value="${karat}" ${state.market.goldKarat === karat ? "selected" : ""}>عيار ${karat}</option>`).join("")}
            </select>
          </label>
          <label>
            مبلغ المال للزكاة
            <input id="zakatCashInput" type="number" value="${state.market.zakatCash}" />
          </label>
          <div class="finance-flow">
            <div class="flow-line"><span>قيمة الذهب</span><strong>${formatMoney(gold.goldValue)}</strong></div>
            <div class="flow-line"><span>زكاة الذهب 2.5%</span><strong>${formatMoney(gold.goldZakat)}</strong></div>
            <div class="flow-line"><span>زكاة المال 2.5%</span><strong>${formatMoney(gold.moneyZakat)}</strong></div>
          </div>
        </div>
        <div class="gold-price-board">
          <div class="summary-card"><span>جرام 24</span><strong>${formatMoney(gold.gram24)}</strong></div>
          <div class="summary-card"><span>جرام 21</span><strong>${formatMoney(gold.gram21)}</strong></div>
          <div class="summary-card"><span>جرام 18</span><strong>${formatMoney(gold.gram18)}</strong></div>
          <div class="summary-card"><span>الجنيه الذهب</span><strong>${formatMoney(gold.goldPound)}</strong></div>
          <div class="summary-card"><span>الأونصة عالميا</span><strong>${state.market.data?.goldUsd ? `$${formatNumber(state.market.data.goldUsd)}` : "غير متاح"}</strong></div>
        </div>
      </div>
    </section>
  `;
}

function renderDomainPage(user, domainId) {
  const domain = domains[domainId];
  const modules = moduleGroups[domainId];
  const activeModule = modules.find((module) => module.id === state.module[domainId]) || modules[0];
  state.module[domainId] = activeModule.id;
  const entries = getEntries(user, domainId, activeModule.id);
  const stats = getModuleStats(user, domainId, activeModule);

  elements.content.innerHTML = `
    <div class="page-head">
      <div>
        <h1>${domain.label}</h1>
        <p>${getDomainDescription(domainId)}</p>
      </div>
      <div class="section-actions">
        <button class="outline-btn" data-open-page="reports" type="button">التخطيط</button>
        <button class="primary-btn" data-open-entry="${domainId}:${activeModule.id}" type="button">إضافة سجل +</button>
      </div>
    </div>

    ${domainId === "learning" ? renderLearningBrainHero(user) : ""}
    ${domainId === "meaning" ? renderZakatCalculators(user) : ""}
    ${renderAIBox(domainId, `تحليل AI لقسم ${domain.label}`)}

    <div class="section-layout" style="--domain-color:${domain.color};--domain-soft:${domain.soft};">
      <aside class="subnav">
        ${modules.map((module) => `
          <button class="subnav-btn ${module.id === activeModule.id ? "is-active" : ""}" data-domain="${domainId}" data-module="${module.id}" type="button">
            <b>${module.label}</b>
            <span>${module.desc}</span>
          </button>
        `).join("")}
      </aside>

      <div class="module-area">
        <div class="module-summary">
          ${stats.map((stat) => `
            <div class="summary-card">
              <span>${escapeHTML(stat.label)}</span>
              <strong>${escapeHTML(stat.value)}</strong>
            </div>
          `).join("")}
        </div>

        <section class="panel">
          <div class="panel-header">
            <div>
              <h2>${activeModule.label}</h2>
              <small>${activeModule.desc}</small>
            </div>
            <button class="primary-btn" data-open-entry="${domainId}:${activeModule.id}" type="button">إضافة سجل +</button>
          </div>
          ${renderEntriesTable(domainId, activeModule, entries)}
        </section>
      </div>
    </div>
  `;
}

function renderEntriesTable(domainId, module, entries) {
  if (!entries.length) return renderEmpty("لا توجد مدخلات بعد في هذا القسم.");
  const fields = module.fields.slice(0, 5);
  return `
    <div class="table-scroll">
      <table class="entry-table">
        <thead>
          <tr>
            <th>التاريخ</th>
            ${fields.map((field) => `<th>${field.label}</th>`).join("")}
            <th>إجراء</th>
          </tr>
        </thead>
        <tbody>
          ${entries.slice().sort(sortNewest).slice(0, 12).map((entry) => `
            <tr>
              <td>${formatShortDate(entry.date)}</td>
              ${fields.map((field) => `<td>${escapeHTML(formatFieldValue(entry.values[field.id], field))}</td>`).join("")}
              <td><button class="ghost-btn" data-delete-entry="${domainId}:${module.id}:${entry.id}" type="button">حذف</button></td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function renderPriorities(user) {
  const tasks = getSortedTasks(user);
  elements.content.innerHTML = `
    <div class="page-head">
      <div>
        <h1>الأولويات</h1>
        <p>كل المهام المهمة والعاجلة مرتبطة بالـ Home والتنبيهات والتقارير.</p>
      </div>
      <button class="primary-btn" data-quick-task type="button">إضافة مهمة +</button>
    </div>

    <div class="dashboard-grid">
      ${renderAIBox("priorities", "تحليل AI للأولويات")}
      <section class="panel wide-panel">
        <div class="panel-header">
          <h2>مصفوفة أيزنهاور</h2>
          <small>${tasks.length} مهمة</small>
        </div>
        ${renderMatrix(user, true)}
      </section>

      <section class="panel">
        <div class="panel-header">
          <h2>حالة اليوم</h2>
        </div>
        <div class="quick-stats">
          ${priorityStats(user).map((item) => `
            <div class="quick-stat">
              <b>${item.value}</b>
              <span>${item.label}</span>
              <i>${item.icon}</i>
            </div>
          `).join("")}
        </div>
      </section>
    </div>

    <section class="panel" style="margin-top:18px;">
      <div class="panel-header">
        <h2>كل المهام</h2>
      </div>
      <div class="list">
        ${tasks.length ? tasks.map((task) => `
          <div class="list-item">
            <button class="task-check ${task.status === "done" ? "is-done" : ""}" data-task-toggle="${task.id}" type="button">✓</button>
            <span>${escapeHTML(task.title)}</span>
            <span class="tag ${task.domain}">${domains[task.domain]?.short || "أولوية"}</span>
            <span class="tag ${task.status}">${task.status === "done" ? "مكتملة" : task.status === "doing" ? "قيد التنفيذ" : "لم تبدأ"}</span>
            <button class="ghost-btn" data-delete-task="${task.id}" type="button">حذف</button>
          </div>
        `).join("") : renderEmpty("لا توجد مهام مسجلة.")}
      </div>
    </section>
  `;
}

function renderPlanningWorkspace(user) {
  const journals = user.data.planning.journals.slice().sort(sortNewest).slice(0, 4);
  const goals = user.data.planning.goals.slice().sort(sortNewest).slice(0, 6);
  const financePlanningModules = moduleGroups.finance.filter((module) => module.category === "planning");
  return `
    <div class="reports-grid planning-grid" style="margin-bottom:18px;">
      <section class="panel">
        <div class="panel-header">
          <h2>دفتر الملاحظات واليوميات</h2>
          <small>كتابة يومية قابلة للتحليل</small>
        </div>
        <form id="planningJournalForm" class="form-grid">
          <label>
            عنوان اليوم
            <input name="title" required placeholder="ماذا حدث اليوم؟" />
          </label>
          <label>
            الحالة العامة
            <select name="mood">
              <option>هادئ</option><option>مضغوط</option><option>منتج</option><option>متعب</option><option>ممتن</option>
            </select>
          </label>
          <label class="full">
            اليوميات
            <textarea name="body" required placeholder="اكتب ملاحظاتك اليومية هنا..."></textarea>
          </label>
          <button class="primary-btn" type="submit">حفظ اليومية</button>
        </form>
        <div class="list" style="margin-top:12px;">
          ${journals.length ? journals.map((entry) => `
            <div class="search-hit">
              <b>${escapeHTML(entry.title)}</b>
              <span>${formatShortDate(entry.date)} | ${escapeHTML(entry.mood)}</span>
              <p>${escapeHTML(entry.body).slice(0, 160)}</p>
            </div>
          `).join("") : renderEmpty("لا توجد يوميات بعد.")}
        </div>
      </section>

      <section class="panel">
        <div class="panel-header">
          <h2>الأهداف القريبة والبعيدة</h2>
          <small>90 يوم إلى 10 سنوات</small>
        </div>
        <form id="planningGoalForm" class="form-grid">
          <label>
            الهدف
            <input name="title" required placeholder="مثال: الوصول إلى B1 في الإنجليزي" />
          </label>
          <label>
            المدى
            <select name="horizon">
              <option>قريب - 30 يوم</option>
              <option>متوسط - 90 يوم</option>
              <option>بعيد - سنة</option>
              <option>استراتيجي - 3 سنوات</option>
              <option>رؤية - 10 سنوات</option>
            </select>
          </label>
          <label>
            نسبة التقدم
            <input name="progress" type="number" min="0" max="100" value="0" />
          </label>
          <label>
            تاريخ مستهدف
            <input name="deadline" type="date" />
          </label>
          <label class="full">
            خطة مختصرة
            <textarea name="plan" placeholder="خطوات التنفيذ والمتابعة..."></textarea>
          </label>
          <button class="primary-btn" type="submit">حفظ الهدف</button>
        </form>
        <div class="bar-chart" style="margin-top:12px;">
          ${goals.length ? goals.map((goal) => `
            <div class="bar-row">
              <span class="bar-label">${escapeHTML(goal.title).slice(0, 18)}</span>
              <span class="bar-track"><span class="bar-fill" style="--w:${clamp(goal.progress)}%;--bar-color:#39ff88;"></span></span>
              <b>${goal.progress}%</b>
            </div>
          `).join("") : renderEmpty("أضف أهدافك لتظهر هنا.")}
        </div>
      </section>
    </div>

    <section class="panel" style="margin-bottom:18px;">
      <div class="panel-header">
        <div>
          <h2>تخطيط المال والعمل المنقول</h2>
          <small>الوحدات التخطيطية أصبحت هنا بدلا من تبويبات المال والعمل.</small>
        </div>
      </div>
      <div class="planning-module-grid">
        ${financePlanningModules.map((module) => {
          const entries = getEntries(user, "finance", module.id).slice().sort(sortNewest).slice(0, 4);
          return `
            <article class="planning-module-card">
              <div class="panel-header">
                <div>
                  <h3>${escapeHTML(module.label)}</h3>
                  <small>${escapeHTML(module.desc)}</small>
                </div>
                <button class="primary-btn" data-open-entry="finance:${module.id}" type="button">إضافة</button>
              </div>
              ${entries.length ? renderEntriesTable("finance", module, entries) : renderEmpty("لا توجد سجلات بعد.")}
            </article>
          `;
        }).join("")}
      </div>
    </section>
  `;
}

function renderMatrix(user, detailed = false) {
  const groups = {
    urgentHigh: {
      title: "عاجل ومهم نفذه الآن",
      color: "#d92d20",
      bg: "#fff3f3",
      line: "#ffb8b8",
      icon: "↯",
      filter: (task) => task.importance === "high" && task.urgency === "urgent"
    },
    laterHigh: {
      title: "مهم وغير عاجل خطط له",
      color: "#16834d",
      bg: "#f1fff7",
      line: "#bee9d1",
      icon: "▦",
      filter: (task) => task.importance === "high" && task.urgency !== "urgent"
    },
    urgentLow: {
      title: "عاجل وغير مهم فوض أو قلل وقته",
      color: "#b56600",
      bg: "#fff8eb",
      line: "#ffd99f",
      icon: "↷",
      filter: (task) => task.importance !== "high" && task.urgency === "urgent"
    },
    laterLow: {
      title: "غير عاجل وغير مهم احذفه",
      color: "#475467",
      bg: "#f8fafc",
      line: "#d8dee8",
      icon: "⌫",
      filter: (task) => task.importance !== "high" && task.urgency !== "urgent"
    }
  };
  const tasks = getSortedTasks(user).filter((task) => task.status !== "done");
  return `
    <div class="matrix">
      ${Object.values(groups).map((box) => {
        const items = tasks.filter(box.filter).slice(0, detailed ? 8 : 4);
        return `
          <div class="matrix-box" style="--box-color:${box.color};--box-bg:${box.bg};--box-line:${box.line};">
            <h3>${box.title} <span>${box.icon}</span></h3>
            ${items.length ? `<ul>${items.map((task) => `<li>${escapeHTML(task.title)}</li>`).join("")}</ul>` : `<p style="margin:0;color:#667085;">لا يوجد</p>`}
          </div>
        `;
      }).join("")}
    </div>
  `;
}

function renderHabits(user) {
  return `
    <div class="habit-grid">
      ${user.data.habits.map((habit) => `
        <div class="habit-row">
          <span class="habit-name">${escapeHTML(habit.name)}</span>
          <div class="habit-days">
            ${habit.days.map((on) => `<span class="day-dot ${on ? "is-on" : ""}" style="--habit-color:${habit.color};">${on ? "✓" : ""}</span>`).join("")}
          </div>
        </div>
      `).join("")}
    </div>
  `;
}

function renderReports(user) {
  const summaries = getAllDomainSummaries(user);
  const entryCounts = Object.keys(domains).map((domainId) => ({
    domainId,
    label: domains[domainId].label,
    count: Object.values(user.data.entries[domainId]).reduce((total, list) => total + list.length, 0),
    color: domains[domainId].color
  }));
  const maxEntries = Math.max(1, ...entryCounts.map((item) => item.count));
  const finance = getFinanceNumbers(user);
  const alerts = getAlerts(user);

  elements.content.innerHTML = `
    <div class="page-head">
      <div>
        <h1>التخطيط</h1>
        <p>مركز التخطيط الذكي: تقارير، يوميات، ملاحظات، أهداف قريبة وبعيدة، وتحليل AI.</p>
      </div>
      <div class="section-actions">
        <button class="primary-btn" data-export-report type="button">تصدير PDF رسمي</button>
      </div>
    </div>

    ${renderPlanningWorkspace(user)}
    ${renderAIBox("planning", "تحليل AI للتخطيط")}

    <div class="overview-grid">
      ${Object.keys(domains).map((domainId) => renderScoreCard(domainId, summaries[domainId])).join("")}
    </div>

    <div class="reports-grid" style="margin-top:18px;">
      <section class="panel">
        <div class="panel-header">
          <h2>درجات الأقسام</h2>
        </div>
        <div class="bar-chart">
          ${Object.keys(domains).map((domainId) => `
            <div class="bar-row">
              <span class="bar-label">${domains[domainId].short}</span>
              <span class="bar-track"><span class="bar-fill" style="--w:${summaries[domainId].score}%;--bar-color:${domains[domainId].color};"></span></span>
              <b>${summaries[domainId].score}%</b>
            </div>
          `).join("")}
        </div>
      </section>

      <section class="panel">
        <div class="panel-header">
          <h2>Cash Flow الشهر الحالي</h2>
        </div>
        <div class="finance-flow">
          <div class="flow-line"><span>إجمالي الدخل</span><strong>${formatMoney(finance.income)}</strong></div>
          <div class="flow-line"><span>إجمالي المصاريف</span><strong>${formatMoney(finance.expenses)}</strong></div>
          <div class="flow-line"><span>صافي المتبقي</span><strong>${formatMoney(finance.net)}</strong></div>
          <div class="flow-line"><span>نسبة الادخار</span><strong>${finance.savingsRate}%</strong></div>
          <div class="flow-line"><span>الديون المتبقية</span><strong>${formatMoney(finance.debts)}</strong></div>
        </div>
      </section>

      <section class="panel">
        <div class="panel-header">
          <h2>عدد المدخلات حسب القسم</h2>
        </div>
        <div class="bar-chart">
          ${entryCounts.map((item) => `
            <div class="bar-row">
              <span class="bar-label">${item.label}</span>
              <span class="bar-track"><span class="bar-fill" style="--w:${Math.round((item.count / maxEntries) * 100)}%;--bar-color:${item.color};"></span></span>
              <b>${item.count}</b>
            </div>
          `).join("")}
        </div>
      </section>

      <section class="panel">
        <div class="panel-header">
          <h2>تنبيهات ذكية</h2>
          <small>${alerts.length}</small>
        </div>
        <div class="list">
          ${alerts.length ? alerts.map(renderAlertItem).join("") : renderEmpty("كل المؤشرات الأساسية جيدة حاليا.")}
        </div>
      </section>
    </div>
  `;
}

function renderSettings(user) {
  elements.content.innerHTML = `
    <div class="page-head">
      <div>
        <h1>الإعدادات</h1>
        <p>بيانات المستخدم، الصورة، الأهداف، والتصدير والاستيراد.</p>
      </div>
      <button class="danger-btn" data-logout type="button">تسجيل الخروج</button>
    </div>

    <section class="panel">
      <div class="panel-header">
        <h2>بيانات المستخدم</h2>
      </div>
      <form id="profileForm" class="profile-editor">
        <div class="profile-preview">
          <img id="settingsProfileImage" src="${user.avatar || defaultAvatar(user.name)}" alt="صورة المستخدم" />
          <input id="profilePhotoInput" type="file" accept="image/*" />
        </div>
        <div class="form-grid">
          <label>
            الاسم
            <input name="name" value="${escapeAttr(user.name)}" required />
          </label>
          <label>
            اسم المستخدم
            <input name="username" value="${escapeAttr(user.username)}" readonly />
          </label>
          <label>
            البريد الإلكتروني
            <input name="email" type="email" value="${escapeAttr(user.email)}" required />
          </label>
          <label>
            جملة الترحيب
            <input name="subtitle" value="${escapeAttr(user.profile.subtitle || "")}" />
          </label>
          <label>
            المدينة
            <input name="city" value="${escapeAttr(user.profile.city || "")}" />
          </label>
          <label>
            السن
            <input name="age" type="number" value="${escapeAttr(user.profile.age || "")}" />
          </label>
          <label>
            الطول
            <input name="height" type="number" value="${escapeAttr(user.profile.height || "")}" />
          </label>
          <label class="full">
            الهدف الشخصي
            <textarea name="goal">${escapeHTML(user.profile.goal || "")}</textarea>
          </label>
          <button class="primary-btn" type="submit">حفظ البيانات</button>
        </div>
      </form>
    </section>

    <div class="settings-grid" style="margin-top:18px;">
      <section class="panel">
        <div class="panel-header">
          <h2>أهداف يومية</h2>
        </div>
        <form id="targetsForm" class="form-grid">
          <label>
            السعرات المستهدفة
            <input name="dailyCaloriesTarget" type="number" value="${user.settings.dailyCaloriesTarget || 2200}" />
          </label>
          <label>
            المياه باللتر
            <input name="waterTarget" type="number" step="0.1" value="${user.settings.waterTarget || 2.5}" />
          </label>
          <label>
            الخطوات
            <input name="stepsTarget" type="number" value="${user.settings.stepsTarget || 8000}" />
          </label>
          <label>
            ساعات النوم
            <input name="sleepTarget" type="number" step="0.1" value="${user.settings.sleepTarget || 7}" />
          </label>
          <label>
            ساعات التعلم
            <input name="learningTarget" type="number" step="0.1" value="${user.settings.learningTarget || 2}" />
          </label>
          <label>
            نسبة الادخار %
            <input name="savingsTargetRate" type="number" value="${user.settings.savingsTargetRate || 20}" />
          </label>
          <button class="primary-btn" type="submit">حفظ الأهداف</button>
        </form>
      </section>

      <section class="panel">
        <div class="panel-header">
          <h2>إدارة البيانات</h2>
        </div>
        <p style="color:var(--muted);line-height:1.8;margin-top:0;">تصدير واستيراد نسخة احتياطية وإدارة حسابات الدخول بدون عرض تفاصيل تقنية داخل الواجهة.</p>
        <div class="data-actions">
          <button class="outline-btn" data-export-db type="button">تصدير البيانات</button>
          <label class="ghost-btn" style="display:inline-flex;">
            استيراد بيانات
            <input id="importDbInput" type="file" accept="application/json" hidden />
          </label>
          <button class="outline-btn" data-export-users type="button">تصدير حسابات الدخول</button>
          <button class="danger-btn" data-clear-user type="button">مسح بيانات هذا المستخدم</button>
        </div>
      </section>

      <section class="panel">
        <div class="panel-header">
          <h2>تغيير كلمة المرور</h2>
        </div>
        <form id="passwordForm" class="form-grid">
          <label>
            كلمة المرور الحالية
            <input name="currentPassword" type="password" required />
          </label>
          <label>
            كلمة المرور الجديدة
            <input name="newPassword" type="password" minlength="6" required />
          </label>
          <button class="primary-btn" type="submit">تغيير كلمة المرور</button>
        </form>
      </section>

      <section class="panel">
        <div class="panel-header">
          <h2>الذكاء الاصطناعي</h2>
        </div>
        <p style="color:var(--muted);line-height:1.8;margin-top:0;">يمكن ربط Gemini للتحليل والتخطيط من خلال ملف الإعدادات، أو استخدام التحليل المحلي المدمج بدون اتصال خارجي.</p>
        <div class="quick-stats">
          <div class="quick-stat"><b>${getAISettings().enabled ? "Gemini" : "محلي"}</b><span>نظام التحليل الحالي</span><i>✺</i></div>
          <div class="quick-stat"><b>${getAISettings().model || "gemini-2.5-flash"}</b><span>نموذج التحليل</span><i>AI</i></div>
        </div>
      </section>
    </div>
  `;
}

function onNavClick(event) {
  const button = event.target.closest("[data-page]");
  if (!button) return;
  state.page = button.dataset.page;
  renderPage();
}

function onContentClick(event) {
  const financeTabControl = event.target.closest("[data-finance-tab]");
  if (financeTabControl && elements.content.contains(financeTabControl)) {
    switchFinanceTab(financeTabControl.dataset.financeTab);
    return;
  }

  const button = event.target.closest("button");
  if (!button) return;

  if (button.dataset.page) {
    state.page = button.dataset.page;
    renderPage();
    return;
  }
  if (button.dataset.openPage) {
    state.page = button.dataset.openPage;
    renderPage();
    return;
  }
  if (button.dataset.financeTab) {
    switchFinanceTab(button.dataset.financeTab);
    return;
  }
  if (button.classList.contains("subnav-btn")) {
    state.module[button.dataset.domain] = button.dataset.module;
    renderPage();
    return;
  }
  if (button.dataset.openEntry) {
    const [domainId, moduleId] = button.dataset.openEntry.split(":");
    openEntryDialog(domainId, moduleId);
    return;
  }
  if (button.dataset.quickTask !== undefined) {
    openQuickTaskDialog();
    return;
  }
  if (button.dataset.taskToggle) {
    toggleTask(button.dataset.taskToggle);
    return;
  }
  if (button.dataset.deleteTask) {
    deleteTask(button.dataset.deleteTask);
    return;
  }
  if (button.dataset.deleteEntry) {
    deleteEntry(button.dataset.deleteEntry);
    return;
  }
  if (button.dataset.exportReport !== undefined) {
    exportReport();
    return;
  }
  if (button.dataset.aiSection) {
    runAIAnalysis(button.dataset.aiSection);
    return;
  }
  if (button.dataset.refreshMarket !== undefined) {
    loadMarketRates();
    return;
  }
  if (button.dataset.calculateGold !== undefined) {
    calculateGoldTools();
    renderPage();
    return;
  }
  if (button.dataset.logout !== undefined) {
    localStorage.removeItem(SESSION_KEY);
    renderAuthOrApp();
    return;
  }
  if (button.dataset.exportDb !== undefined) {
    exportDatabase();
    return;
  }
  if (button.dataset.exportUsers !== undefined) {
    exportUserCredentials();
    return;
  }
  if (button.dataset.clearUser !== undefined) {
    clearCurrentUserData();
  }
}

function onDocumentFallbackClick(event) {
  const button = event.target.closest("button[data-finance-tab]");
  if (!button || !elements.content?.contains(button)) return;
  switchFinanceTab(button.dataset.financeTab);
}

function switchFinanceTab(tab) {
  state.financeTab = tab;
  const firstModule = moduleGroups.finance.find((module) => module.category === state.financeTab);
  if (firstModule) state.module.finance = firstModule.id;
  renderPage();
}

function onContentSubmit(event) {
  const user = getCurrentUser();
  if (!user) return;
  if (event.target.id === "profileForm") {
    event.preventDefault();
    const form = new FormData(event.target);
    user.name = String(form.get("name") || "").trim();
    user.email = String(form.get("email") || "").toLowerCase().trim();
    user.profile.subtitle = String(form.get("subtitle") || "");
    user.profile.city = String(form.get("city") || "");
    user.profile.age = String(form.get("age") || "");
    user.profile.height = String(form.get("height") || "");
    user.profile.goal = String(form.get("goal") || "");
    saveDB();
    showToast("تم حفظ بيانات المستخدم.");
    renderPage();
  }
  if (event.target.id === "targetsForm") {
    event.preventDefault();
    const form = new FormData(event.target);
    ["dailyCaloriesTarget", "waterTarget", "stepsTarget", "sleepTarget", "learningTarget", "savingsTargetRate"].forEach((key) => {
      user.settings[key] = toNumber(form.get(key));
    });
    saveDB();
    showToast("تم حفظ الأهداف اليومية.");
    renderPage();
  }
  if (event.target.id === "passwordForm") {
    event.preventDefault();
    const form = new FormData(event.target);
    if (String(form.get("currentPassword") || "") !== user.password) {
      showToast("كلمة المرور الحالية غير صحيحة.");
      return;
    }
    user.password = String(form.get("newPassword") || "");
    user.passwordUpdatedAt = nowISO();
    saveDB();
    showToast("تم تغيير كلمة المرور.");
    renderPage();
  }
  if (event.target.id === "planningJournalForm") {
    event.preventDefault();
    const form = new FormData(event.target);
    user.data.planning.journals.push({
      id: id(),
      date: todayISO(),
      createdAt: nowISO(),
      title: String(form.get("title") || "").trim(),
      mood: String(form.get("mood") || ""),
      body: String(form.get("body") || "").trim()
    });
    saveDB();
    showToast("تم حفظ اليومية.");
    renderPage();
  }
  if (event.target.id === "planningGoalForm") {
    event.preventDefault();
    const form = new FormData(event.target);
    user.data.planning.goals.push({
      id: id(),
      date: todayISO(),
      createdAt: nowISO(),
      title: String(form.get("title") || "").trim(),
      horizon: String(form.get("horizon") || ""),
      progress: clamp(toNumber(form.get("progress"))),
      deadline: String(form.get("deadline") || ""),
      plan: String(form.get("plan") || "").trim()
    });
    saveDB();
    showToast("تم حفظ الهدف.");
    renderPage();
  }
}

function onContentChange(event) {
  const user = getCurrentUser();
  if (!user) return;
  if (event.target.id === "profilePhotoInput") {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      user.avatar = String(reader.result);
      saveDB();
      renderTopbar(user);
      const preview = document.getElementById("settingsProfileImage");
      if (preview) preview.src = user.avatar;
      showToast("تم تحديث الصورة.");
    };
    reader.readAsDataURL(file);
  }
  if (event.target.id === "importDbInput") {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => importDatabase(String(reader.result));
    reader.readAsText(file);
  }
}

function getAISettings() {
  return window.lifeOSAI || { enabled: false };
}

async function runAIAnalysis(section) {
  const user = getCurrentUser();
  if (!user) return;
  state.market.aiResponses[section] = "جاري التحليل...";
  renderPage();
  const prompt = buildAIPrompt(user, section);
  try {
    const settings = getAISettings();
    if (settings.enabled && settings.apiKey) {
      const url = `${settings.endpoint || "https://generativelanguage.googleapis.com/v1beta"}/models/${settings.model || "gemini-2.5-flash"}:generateContent`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": settings.apiKey
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      });
      if (!response.ok) throw new Error(`Gemini API error ${response.status}`);
      const data = await response.json();
      state.market.aiResponses[section] = data.candidates?.[0]?.content?.parts?.map((part) => part.text).join("\n").trim() || localAIAnalysis(user, section);
    } else {
      state.market.aiResponses[section] = localAIAnalysis(user, section);
    }
  } catch (error) {
    console.warn("AI analysis failed", error);
    state.market.aiResponses[section] = `${localAIAnalysis(user, section)}\n\nملاحظة: تعذر الاتصال بخدمة AI الخارجية حاليا.`;
  }
  renderPage();
}

function buildAIPrompt(user, section) {
  const summaries = getAllDomainSummaries(user);
  const finance = getFinanceNumbers(user);
  const alerts = getAlerts(user).map((alert) => alert.text).join(" | ");
  return `
أنت محلل تخطيط شخصي رسمي. اكتب بالعربية المختصرة في 5 نقاط فقط.
القسم المطلوب: ${section}
درجات الأقسام: ${Object.keys(domains).map((key) => `${domains[key].label}: ${summaries[key].score}%`).join(", ")}
الماليات: دخل ${finance.income}, مصاريف ${finance.expenses}, صافي ${finance.net}, ديون ${finance.debts}
التنبيهات: ${alerts || "لا توجد"}
المطلوب: تحليل، خطر رئيسي، فرصة، 3 خطوات تنفيذية، ومؤشر متابعة.
`;
}

function localAIAnalysis(user, section) {
  const summaries = getAllDomainSummaries(user);
  const weakest = Object.entries(summaries).sort((a, b) => a[1].score - b[1].score)[0];
  const finance = getFinanceNumbers(user);
  const alerts = getAlerts(user).length;
  const focus = domains[weakest[0]]?.label || "القسم الأقل";
  const moneyNote = finance.net < 0 ? "اضبط المصاريف المتغيرة خلال 48 ساعة." : "استثمر الفائض في الادخار أو صندوق الطوارئ.";
  return [
    `القراءة العامة: الأولوية الآن هي ${focus} لأن مؤشره الأقل بين الأقسام.`,
    `الخطر: لديك ${alerts} تنبيه يحتاج ترتيب حتى لا يتحول إلى ضغط يومي.`,
    `المال والعمل: ${moneyNote}`,
    "الخطة التنفيذية: اختر مهمة واحدة حرجة، وسجل قياسا واحدا، وأغلق متابعة واحدة قبل نهاية اليوم.",
    `مؤشر المتابعة: ارفع ${focus} بمقدار 5% خلال أسبوع عبر إدخال يومي منتظم.`
  ].join("\n");
}

function openEntryDialog(domainId, moduleId) {
  const module = moduleGroups[domainId].find((item) => item.id === moduleId);
  if (!module) return;
  state.entryContext = { domainId, moduleId };
  elements.entryTitle.textContent = `إضافة سجل: ${module.label}`;
  elements.entrySubtitle.textContent = module.desc;
  elements.entryFields.innerHTML = renderEntryFields(module);
  elements.entryDialog.showModal();
}

function renderEntryFields(module) {
  const dateField = `
    <label>
      التاريخ
      <input name="date" type="date" value="${todayISO()}" required />
    </label>
  `;
  return dateField + module.fields.map((field) => {
    const className = field.full ? "full" : "";
    if (field.type === "textarea") {
      return `
        <label class="${className}">
          ${field.label}
          <textarea name="${field.id}" placeholder="${escapeAttr(field.placeholder || "")}"></textarea>
        </label>
      `;
    }
    if (field.type === "select") {
      return `
        <label class="${className}">
          ${field.label}
          <select name="${field.id}">
            ${field.options.map((option) => `<option value="${escapeAttr(option)}">${escapeHTML(option)}</option>`).join("")}
          </select>
        </label>
      `;
    }
    if (field.type === "file") {
      return `
        <label class="${className}">
          ${field.label}
          <input name="${field.id}" type="file" />
        </label>
      `;
    }
    return `
      <label class="${className}">
        ${field.label}${field.unit ? ` (${field.unit})` : ""}
        <input name="${field.id}" type="${field.type}" placeholder="${escapeAttr(field.placeholder || "")}" ${field.type === "number" ? "step=\"0.1\"" : ""} />
      </label>
    `;
  }).join("");
}

async function onEntrySubmit(event) {
  event.preventDefault();
  if (event.submitter?.value === "cancel") {
    elements.entryDialog.close();
    return;
  }
  const user = getCurrentUser();
  const context = state.entryContext;
  if (!user || !context) return;
  const module = moduleGroups[context.domainId].find((item) => item.id === context.moduleId);
  const form = new FormData(elements.entryForm);
  const date = String(form.get("date") || todayISO());
  const values = {};
  for (const field of module.fields) {
    const raw = form.get(field.id);
    if (field.type === "file") {
      values[field.id] = raw && raw.size ? await readFileAsDataURL(raw) : null;
    } else {
      values[field.id] = field.type === "number" ? toNumber(raw) : String(raw || "").trim();
    }
  }
  getEntries(user, context.domainId, context.moduleId).push({
    id: id(),
    date,
    createdAt: nowISO(),
    values
  });
  saveDB();
  elements.entryDialog.close();
  showToast("تم حفظ السجل وربطه بالداشبورد.");
  renderPage();
}

function openQuickTaskDialog() {
  const select = elements.quickTaskForm.querySelector("select[name='domain']");
  select.innerHTML = [
    ...Object.keys(domains).map((domainId) => `<option value="${domainId}">${domains[domainId].label}</option>`),
    `<option value="priorities">الأولويات</option>`
  ].join("");
  elements.quickTaskDialog.showModal();
}

function onQuickTaskSubmit(event) {
  event.preventDefault();
  if (event.submitter?.value === "cancel") {
    elements.quickTaskDialog.close();
    return;
  }
  const user = getCurrentUser();
  if (!user) return;
  const form = new FormData(elements.quickTaskForm);
  user.data.tasks.push({
    id: id(),
    title: String(form.get("title") || "").trim(),
    domain: String(form.get("domain") || "priorities"),
    importance: String(form.get("importance") || "high"),
    urgency: String(form.get("urgency") || "later"),
    due: String(form.get("due") || ""),
    status: String(form.get("status") || "todo"),
    createdAt: nowISO()
  });
  elements.quickTaskForm.reset();
  elements.quickTaskDialog.close();
  saveDB();
  showToast("تمت إضافة المهمة.");
  renderPage();
}

function toggleTask(taskId) {
  const user = getCurrentUser();
  const task = user?.data.tasks.find((item) => item.id === taskId);
  if (!task) return;
  task.status = task.status === "done" ? "todo" : "done";
  saveDB();
  renderPage();
}

function deleteTask(taskId) {
  const user = getCurrentUser();
  if (!user) return;
  user.data.tasks = user.data.tasks.filter((task) => task.id !== taskId);
  saveDB();
  showToast("تم حذف المهمة.");
  renderPage();
}

function deleteEntry(token) {
  const user = getCurrentUser();
  if (!user) return;
  const [domainId, moduleId, entryId] = token.split(":");
  user.data.entries[domainId][moduleId] = getEntries(user, domainId, moduleId).filter((entry) => entry.id !== entryId);
  saveDB();
  showToast("تم حذف السجل.");
  renderPage();
}

function getEntries(user, domainId, moduleId) {
  ensureUserShape(user);
  return user.data.entries[domainId][moduleId];
}

function getAllEntries(user, domainId) {
  return Object.values(user.data.entries[domainId] || {}).flat();
}

function entriesOn(user, domainId, moduleId, date = todayISO()) {
  return getEntries(user, domainId, moduleId).filter((entry) => entry.date === date);
}

function entriesThisMonth(user, domainId, moduleId) {
  const month = todayISO().slice(0, 7);
  return getEntries(user, domainId, moduleId).filter((entry) => entry.date?.startsWith(month));
}

function latestEntry(user, domainId, moduleId) {
  return getEntries(user, domainId, moduleId).slice().sort(sortNewest)[0] || null;
}

function sumField(entries, field) {
  return entries.reduce((total, entry) => total + toNumber(entry.values[field]), 0);
}

function latestValue(user, domainId, moduleId, field, fallback = 0) {
  const entry = latestEntry(user, domainId, moduleId);
  if (!entry) return fallback;
  const value = entry.values[field];
  return value === undefined || value === "" ? fallback : value;
}

function todaySum(user, domainId, moduleId, field) {
  return sumField(entriesOn(user, domainId, moduleId), field);
}

function getAllDomainSummaries(user) {
  return {
    health: getHealthSummary(user),
    learning: getLearningSummary(user),
    finance: getFinanceSummary(user),
    relationships: getRelationshipsSummary(user),
    meaning: getMeaningSummary(user)
  };
}

function getHealthSummary(user) {
  const settings = user.settings;
  const water = todaySum(user, "health", "drinks", "water");
  const calories = todaySum(user, "health", "nutrition", "calories");
  const protein = todaySum(user, "health", "nutrition", "protein");
  const steps = todaySum(user, "health", "movement", "steps");
  const sleep = Number(latestValue(user, "health", "sleep", "hours", 0));
  const gymDays = uniqueRecentDays(getEntries(user, "health", "gym"), 7);
  const weight = latestValue(user, "health", "body", "weight", "--");
  const meds = entriesOn(user, "health", "medicine").filter((entry) => entry.values.status !== "تم أخذه").length;
  const targetCalories = settings.dailyCaloriesTarget || 2200;
  const calorieScore = calories ? 100 - Math.min(100, Math.abs(calories - targetCalories) / targetCalories * 100) : 40;
  const score = average([
    ratioScore(water, settings.waterTarget || 2.5),
    ratioScore(protein, 120),
    ratioScore(steps, settings.stepsTarget || 8000),
    ratioScore(sleep, settings.sleepTarget || 7),
    ratioScore(gymDays, 4),
    calorieScore
  ]);
  return {
    score,
    metrics: [
      { icon: "☾", value: formatNumber(sleep), label: "نوم (س)" },
      { icon: "♢", value: formatNumber(water), label: "مياه" },
      { icon: "♨", value: formatNumber(calories), label: "سعرات" },
      { icon: "⌁", value: formatNumber(steps), label: "خطوة" },
      { icon: "◖", value: String(meds), label: "أدوية" }
    ],
    details: { water, calories, protein, steps, sleep, gymDays, weight, meds }
  };
}

function getLearningSummary(user) {
  const hours = todaySum(user, "learning", "dailyStudy", "focusHours") + todaySum(user, "learning", "courses", "hours");
  const courses = getEntries(user, "learning", "courses");
  const progress = average(courses.map((entry) => toNumber(entry.values.progress)).filter(Boolean));
  const words = todaySum(user, "learning", "language", "newWords");
  const pages = todaySum(user, "learning", "reading", "pages");
  const projects = getEntries(user, "learning", "projects").filter((entry) => entry.values.status !== "مكتمل").length;
  const skillProgress = average(getEntries(user, "learning", "skills").map((entry) => toNumber(entry.values.progress)).filter(Boolean));
  const score = average([
    ratioScore(hours, user.settings.learningTarget || 2),
    progress || 50,
    ratioScore(words, 15),
    ratioScore(pages, 20),
    ratioScore(projects, 2),
    skillProgress || 50
  ]);
  return {
    score,
    metrics: [
      { icon: "◷", value: formatNumber(hours), label: "ساعات" },
      { icon: "▰", value: `${courses.length}`, label: "كورسات" },
      { icon: "▤", value: `${words}`, label: "كلمة" },
      { icon: "▧", value: `${pages}`, label: "صفحة" },
      { icon: "▣", value: `${projects}`, label: "مشروع" }
    ],
    details: { hours, progress, words, pages, projects, skillProgress }
  };
}

function getFinanceSummary(user) {
  const finance = getFinanceNumbers(user);
  const freelanceOffers = entriesThisMonth(user, "finance", "freelance").filter((entry) => entry.values.status === "مرسل").length;
  const jobs = entriesThisMonth(user, "finance", "jobSearch").length;
  const score = average([
    clamp(finance.savingsRate * 4),
    finance.net >= 0 ? 85 : 25,
    finance.debts ? clamp(100 - (finance.debts / Math.max(finance.income, 1)) * 100) : 95,
    ratioScore(freelanceOffers, 3),
    ratioScore(jobs, 4)
  ]);
  return {
    score,
    metrics: [
      { icon: "↑", value: formatCompact(finance.income), label: "دخل" },
      { icon: "↓", value: formatCompact(finance.expenses), label: "مصروف" },
      { icon: "▣", value: formatCompact(finance.debts), label: "ديون" },
      { icon: "♟", value: formatCompact(finance.savings), label: "ادخار" },
      { icon: "▥", value: formatCompact(finance.investments), label: "استثمار" }
    ],
    details: finance
  };
}

function getRelationshipsSummary(user) {
  const mood = Number(latestValue(user, "relationships", "mood", "mood", 0));
  const stress = Number(latestValue(user, "relationships", "mood", "stress", 5));
  const contacts = [
    ...entriesOn(user, "relationships", "family"),
    ...entriesOn(user, "relationships", "friends"),
    ...entriesOn(user, "relationships", "communication")
  ].length;
  const support = entriesOn(user, "relationships", "support").length;
  const conflicts = getEntries(user, "relationships", "conflicts").filter((entry) => entry.values.status !== "مغلق").length;
  const gratitude = entriesOn(user, "relationships", "gratitude").length;
  const marriage = latestValue(user, "relationships", "loveMarriage", "stage", "غير محدد");
  const score = average([
    mood * 10,
    (10 - Math.min(10, stress)) * 10,
    ratioScore(contacts, 3),
    support ? 80 : 45,
    conflicts ? Math.max(35, 90 - conflicts * 18) : 90,
    gratitude ? 90 : 55
  ]);
  return {
    score,
    metrics: [
      { icon: "☺", value: `${mood}/10`, label: "Mood" },
      { icon: "☵", value: `${contacts}`, label: "تواصل" },
      { icon: "♡", value: `${support}`, label: "دعم" },
      { icon: "♧", value: String(marriage).slice(0, 8), label: "زواج" },
      { icon: "●", value: `${conflicts}`, label: "خلاف" }
    ],
    details: { mood, stress, contacts, support, conflicts, gratitude, marriage }
  };
}

function getMeaningSummary(user) {
  const prayers = Number(latestValue(user, "meaning", "worship", "prayers", 0));
  const quran = todaySum(user, "meaning", "worship", "quranPages");
  const valueScore = Number(latestValue(user, "meaning", "values", "score", 0));
  const goalProgress = Number(latestValue(user, "meaning", "personalGoal", "progress", 0));
  const giving = entriesOn(user, "meaning", "giving").length;
  const reflection = entriesOn(user, "meaning", "reflection").length;
  const innerPeace = Number(latestValue(user, "meaning", "acceptance", "innerPeace", 7));
  const score = average([
    ratioScore(prayers, 5),
    ratioScore(quran, 2),
    valueScore * 10 || 55,
    goalProgress || 50,
    giving ? 85 : 50,
    reflection ? 90 : 50,
    innerPeace * 10
  ]);
  return {
    score,
    metrics: [
      { icon: "▥", value: `${prayers}/5`, label: "عبادة" },
      { icon: "♢", value: `${valueScore}/10`, label: "قيم" },
      { icon: "◎", value: `${goalProgress}%`, label: "هدف" },
      { icon: "☺", value: `${innerPeace}/10`, label: "رضا" },
      { icon: "▤", value: `${reflection}`, label: "مراجعة" }
    ],
    details: { prayers, quran, valueScore, goalProgress, giving, reflection, innerPeace }
  };
}

function getFinanceNumbers(user) {
  const income = sumField(entriesThisMonth(user, "finance", "income"), "amount");
  const expenses =
    sumField(entriesThisMonth(user, "finance", "expenses"), "amount") +
    sumField(entriesThisMonth(user, "finance", "bills"), "amount") +
    sumField(entriesThisMonth(user, "finance", "expenseAnalysis"), "amount");
  const debts = getEntries(user, "finance", "debts").reduce((total, entry) => {
    return entry.values.status === "تم السداد" ? total : total + toNumber(entry.values.remaining);
  }, 0);
  const savings = latestValue(user, "finance", "savings", "saved", 0);
  const emergency = latestValue(user, "finance", "emergencyFund", "current", 0);
  const investments = latestValue(user, "finance", "investments", "value", 0);
  const net = income - expenses;
  const savingsRate = income ? Math.round(((Number(savings) + Number(emergency)) / income) * 100) : 0;
  return { income, expenses, debts, savings: Number(savings), emergency: Number(emergency), investments: Number(investments), net, savingsRate };
}

function getBreakdown(entries, labelField, valueField) {
  const map = new Map();
  entries.forEach((entry) => {
    const label = entry.values[labelField] || "غير محدد";
    const value = valueField ? toNumber(entry.values[valueField]) : 1;
    map.set(label, (map.get(label) || 0) + value);
  });
  return Array.from(map, ([label, value]) => ({ label, value })).sort((a, b) => b.value - a.value);
}

function getBudgetNumbers(user) {
  const planned = sumField(entriesThisMonth(user, "finance", "budget"), "planned");
  const spent = sumField(entriesThisMonth(user, "finance", "budget"), "spent");
  return {
    planned,
    spent,
    remaining: planned - spent
  };
}

function getEmergencyFundNumbers(user) {
  const latest = latestEntry(user, "finance", "emergencyFund");
  const current = toNumber(latest?.values.current);
  const monthlyNeed = toNumber(latest?.values.monthlyNeed);
  const targetMonths = toNumber(latest?.values.targetMonths) || 3;
  const target = monthlyNeed * targetMonths;
  return {
    current,
    monthlyNeed,
    targetMonths,
    target,
    coverageMonths: monthlyNeed ? formatNumber(current / monthlyNeed) : "0",
    progress: target ? Math.min(100, Math.round((current / target) * 100)) : 0
  };
}

function getCashflowProjection(user) {
  const latest = latestEntry(user, "finance", "cashflowPlan");
  if (!latest) {
    const finance = getFinanceNumbers(user);
    return { projectedNet: finance.net };
  }
  const projectedNet =
    toNumber(latest.values.openingBalance) +
    toNumber(latest.values.expectedIncome) -
    toNumber(latest.values.fixedExpenses) -
    toNumber(latest.values.variableBudget);
  return { projectedNet };
}

function getWorkNumbers(user) {
  const jobLinks = getEntries(user, "finance", "jobLinks");
  const freelance = getEntries(user, "finance", "freelancePipeline");
  const workTasks = getEntries(user, "finance", "workTasks");
  const files = getEntries(user, "finance", "requiredFiles");
  return {
    jobLinks: jobLinks.length,
    activeApplications: jobLinks.filter((entry) => ["تم التقديم", "مقابلة"].includes(entry.values.status)).length,
    freelanceProjects: freelance.filter((entry) => !["Delivered", "Closed"].includes(entry.values.stage)).length,
    freelanceValue: sumField(freelance, "price"),
    openTasks: workTasks.filter((entry) => entry.values.status !== "مكتملة").length,
    files: files.filter((entry) => entry.values.attachment).length
  };
}

function getQuickStats(user) {
  const health = getHealthSummary(user).details;
  const learning = getLearningSummary(user).details;
  const finance = getFinanceNumbers(user);
  const relations = getRelationshipsSummary(user).details;
  return [
    { label: "عدد الخطوات اليوم", value: formatNumber(health.steps), icon: "⌁" },
    { label: "السعرات المتبقية", value: formatNumber(Math.max((user.settings.dailyCaloriesTarget || 2200) - health.calories, 0)), icon: "♨" },
    { label: "ساعات النوم", value: formatNumber(health.sleep), icon: "☾" },
    { label: "إجمالي المصاريف", value: formatMoney(finance.expenses), icon: "▣" },
    { label: "ساعات التعلم", value: formatNumber(learning.hours), icon: "◷" },
    { label: "المزاج العام", value: relations.mood >= 7 ? "جيد" : relations.mood >= 5 ? "متوسط" : "منخفض", icon: "☺" }
  ];
}

function getAlerts(user) {
  const alerts = [];
  const health = getHealthSummary(user).details;
  const finance = getFinanceNumbers(user);
  const relation = getRelationshipsSummary(user).details;

  if (health.water < (user.settings.waterTarget || 2.5) * 0.7) {
    alerts.push({ domain: "health", time: "الآن", text: `المياه قليلة: ${formatNumber(health.water)} لتر فقط.` });
  }
  if (health.sleep && health.sleep < 6) {
    alerts.push({ domain: "health", time: "صباحا", text: `النوم قليل: ${formatNumber(health.sleep)} ساعات.` });
  }
  if (health.calories > (user.settings.dailyCaloriesTarget || 2200) * 1.15) {
    alerts.push({ domain: "health", time: "اليوم", text: "السعرات أعلى من الهدف اليومي." });
  }
  entriesOn(user, "health", "medicine").forEach((entry) => {
    if (entry.values.status !== "تم أخذه") {
      alerts.push({ domain: "health", time: entry.values.time || "اليوم", text: `دواء مستحق: ${entry.values.name || "دواء"}.` });
    }
  });
  const dueDebts = getEntries(user, "finance", "debts").filter((entry) => {
    return entry.values.status !== "تم السداد" && entry.values.dueDate && entry.values.dueDate <= todayISO();
  });
  dueDebts.forEach((entry) => {
    alerts.push({ domain: "finance", time: "قريب", text: `قسط مستحق: ${entry.values.debtName || "دين"} بقيمة ${formatMoney(entry.values.installment)}.` });
  });
  if (finance.income && finance.expenses > finance.income * 0.85) {
    alerts.push({ domain: "finance", time: "الشهر", text: "المصاريف اقتربت جدا من الدخل الشهري." });
  }
  if (relation.stress >= 8) {
    alerts.push({ domain: "relationships", time: "اليوم", text: "مستوى التوتر عالي، محتاج تفريغ أو راحة." });
  }
  if (relation.contacts === 0) {
    alerts.push({ domain: "relationships", time: "اليوم", text: "لا يوجد تواصل اجتماعي مسجل اليوم." });
  }
  const openImportant = user.data.tasks.filter((task) => task.status !== "done" && task.importance === "high" && task.urgency === "urgent");
  openImportant.slice(0, 2).forEach((task) => {
    alerts.push({ domain: domains[task.domain] ? task.domain : "health", time: task.due || "اليوم", text: `مهمة عاجلة: ${task.title}` });
  });
  return alerts.slice(0, 12);
}

function getModuleStats(user, domainId, module) {
  const entries = getEntries(user, domainId, module.id);
  const latest = entries.slice().sort(sortNewest)[0];
  const linkedTasks = user.data.tasks.filter((task) => task.domain === domainId && task.status !== "done").length;
  const numericValues = module.fields
    .filter((field) => field.type === "number")
    .flatMap((field) => entries.map((entry) => toNumber(entry.values[field.id])).filter((value) => value > 0));
  return [
    { label: "عدد السجلات", value: String(entries.length) },
    { label: "آخر تحديث", value: latest ? formatShortDate(latest.date) : "لا يوجد" },
    { label: "مهام مفتوحة", value: String(linkedTasks) },
    { label: "متوسط الأرقام", value: numericValues.length ? formatNumber(average(numericValues)) : "غير متاح" }
  ];
}

function priorityStats(user) {
  const tasks = user.data.tasks;
  const done = tasks.filter((task) => task.status === "done").length;
  const urgent = tasks.filter((task) => task.status !== "done" && task.urgency === "urgent").length;
  const important = tasks.filter((task) => task.status !== "done" && task.importance === "high").length;
  const rate = tasks.length ? Math.round((done / tasks.length) * 100) : 0;
  return [
    { label: "مهام مكتملة", value: String(done), icon: "✓" },
    { label: "مهام عاجلة مفتوحة", value: String(urgent), icon: "↯" },
    { label: "مهام مهمة مفتوحة", value: String(important), icon: "◎" },
    { label: "نسبة الإنجاز", value: `${rate}%`, icon: "▥" }
  ];
}

function getSortedTasks(user) {
  const weight = (task) => {
    let value = 0;
    if (task.status === "done") value -= 10;
    if (task.importance === "high") value += 20;
    if (task.urgency === "urgent") value += 20;
    if (task.status === "doing") value += 5;
    return value;
  };
  return user.data.tasks.slice().sort((a, b) => weight(b) - weight(a) || String(a.due).localeCompare(String(b.due)));
}

function getDomainDescription(domainId) {
  const descriptions = {
    health: "كل ما يخص الجيم، الحركة، التغذية، المياه، النوم، المقاسات، الأدوية، والتحاليل.",
    learning: "الدراسة، الكورسات، القراءة، اللغة، المهارات، المشاريع، والإنتاجية اليومية.",
    finance: "الدخل، المصاريف، الديون، الادخار، الاستثمار، العمل، الفريلانس، والبحث عن وظيفة.",
    relationships: "الأسرة، الأصدقاء، العلاقات المهنية، المزاج، الدعم النفسي، الحدود، والخلافات.",
    meaning: "العبادة، القيم، الهدف الشخصي، الرسالة، العطاء، المراجعة، والهوية."
  };
  return descriptions[domainId] || "";
}

function openSearch() {
  elements.searchInput.value = "";
  elements.searchResults.innerHTML = renderEmpty("ابدأ بكتابة كلمة للبحث.");
  elements.searchDialog.showModal();
  setTimeout(() => elements.searchInput.focus(), 60);
}

function renderSearchResults() {
  const query = elements.searchInput.value.trim().toLowerCase();
  if (!query) {
    elements.searchResults.innerHTML = renderEmpty("ابدأ بكتابة كلمة للبحث.");
    return;
  }
  const user = getCurrentUser();
  const hits = [];
  user.data.tasks.forEach((task) => {
    if (task.title.toLowerCase().includes(query)) {
      hits.push({ title: task.title, type: "مهمة", meta: domains[task.domain]?.label || "الأولويات" });
    }
  });
  Object.keys(moduleGroups).forEach((domainId) => {
    moduleGroups[domainId].forEach((module) => {
      getEntries(user, domainId, module.id).forEach((entry) => {
        const text = Object.values(entry.values).join(" ").toLowerCase();
        if (text.includes(query)) {
          hits.push({ title: module.label, type: domains[domainId].label, meta: `${formatShortDate(entry.date)} - ${Object.values(entry.values).slice(0, 2).join(" / ")}` });
        }
      });
    });
  });
  elements.searchResults.innerHTML = hits.length ? hits.slice(0, 30).map((hit) => `
    <div class="search-hit">
      <b>${escapeHTML(hit.title)}</b>
      <span>${escapeHTML(hit.type)} | ${escapeHTML(hit.meta)}</span>
    </div>
  `).join("") : renderEmpty("لا توجد نتائج مطابقة.");
}

function showNotifications() {
  const user = getCurrentUser();
  const alerts = getAlerts(user);
  const groups = Object.keys(domains).map((domainId) => ({
    domainId,
    label: domains[domainId].label,
    alerts: alerts.filter((alert) => alert.domain === domainId)
  })).filter((group) => group.alerts.length);
  elements.notificationsContent.innerHTML = groups.length ? groups.map((group) => `
    <section class="notification-group">
      <h4>${escapeHTML(group.label)} <span>${group.alerts.length}</span></h4>
      <div class="list">
        ${group.alerts.map((alert, index) => `
          <div class="notification-card">
            <b>${index + 1}. ${escapeHTML(alert.text)}</b>
            <span>${escapeHTML(alert.time || "اليوم")}</span>
          </div>
        `).join("")}
      </div>
    </section>
  `).join("") : renderEmpty("لا توجد تنبيهات حاليا.");
  elements.notificationsDialog.showModal();
}

function exportReport() {
  const user = getCurrentUser();
  if (!user) return;
  const scope = buildCurrentPageReportScope(user);
  const html = buildOfficialReportHTML(user, scope);
  openPrintablePDF(html, `life-os-official-${scope.id}-${todayISO()}.html`);
  showToast(`تم تجهيز تقرير PDF رسمي لصفحة ${scope.title}. اختر Save as PDF من نافذة الطباعة.`);
}

function buildCurrentPageReportScope(user) {
  const pageId = state.page || "home";
  if (pageId === "finance") return buildFinanceOfficialReport(user);
  if (domains[pageId]) return buildDomainOfficialReport(user, pageId);
  if (pageId === "priorities") return buildPrioritiesOfficialReport(user);
  if (pageId === "reports") return buildPlanningOfficialReport(user);
  if (pageId === "settings") return buildSettingsOfficialReport(user);
  return buildHomeOfficialReport(user);
}

function buildHomeOfficialReport(user) {
  const summaries = getAllDomainSummaries(user);
  const quick = getQuickStats(user);
  const alerts = getAlerts(user);
  const tasks = getSortedTasks(user).slice(0, 10);
  const finance = getFinanceNumbers(user);
  return {
    id: "home",
    title: "الصفحة الرئيسية",
    subject: "تقرير المتابعة العامة",
    metrics: [
      { label: "متوسط درجات الأقسام", value: `${average(Object.values(summaries).map((item) => item.score))}%` },
      { label: "صافي التدفق الشهري", value: formatMoney(finance.net) },
      { label: "التنبيهات الحالية", value: String(alerts.length) },
      { label: "المهام المفتوحة", value: String(tasks.filter((task) => task.status !== "done").length) }
    ],
    sections: [
      {
        title: "ملخص درجات الأقسام",
        headers: ["القسم", "الدرجة", "المؤشرات الأساسية"],
        rows: buildScoreRows(summaries),
        emptyText: "لا توجد مؤشرات كافية."
      },
      {
        title: "النظرة التنفيذية السريعة",
        headers: ["المؤشر", "القيمة", "ملاحظة"],
        rows: quick.map((item) => [item.label, item.value, "مؤشر يومي مرتبط بالداشبورد."]),
        emptyText: "لا توجد مؤشرات سريعة."
      },
      {
        title: "أهم المهام المفتوحة",
        headers: ["#", "المهمة", "القسم", "الحالة", "الاستحقاق", "الأولوية"],
        rows: buildTaskReportRows(tasks),
        emptyText: "لا توجد مهام مسجلة."
      },
      {
        title: "التنبيهات والمتابعات",
        headers: ["#", "الوقت", "القسم", "التنبيه"],
        rows: buildAlertReportRows(alerts),
        emptyText: "لا توجد تنبيهات حالية."
      }
    ],
    aiNote: state.market.aiResponses.home || localAIAnalysis(user, "home")
  };
}

function buildDomainOfficialReport(user, domainId) {
  const summaries = getAllDomainSummaries(user);
  const summary = summaries[domainId];
  const domain = domains[domainId];
  const domainTasks = getSortedTasks(user).filter((task) => task.domain === domainId).slice(0, 12);
  const domainAlerts = getAlerts(user).filter((alert) => alert.domain === domainId);
  const sections = [
    {
      title: "مؤشرات القسم",
      headers: ["المؤشر", "القيمة", "الوصف"],
      rows: [
        ["درجة القسم", `${summary.score}%`, domain.scoreLabel],
        ...summary.metrics.map((metric) => [metric.label, metric.value, "قيمة مجمعة من سجلات المستخدم"])
      ],
      emptyText: "لا توجد مؤشرات كافية."
    },
    {
      title: "الوحدات والمدخلات",
      headers: ["الوحدة", "الوصف", "عدد السجلات", "آخر تحديث", "ملخص آخر سجل"],
      rows: buildModuleReportRows(user, domainId, moduleGroups[domainId]),
      emptyText: "لا توجد سجلات في هذا القسم."
    },
    {
      title: "آخر السجلات",
      headers: ["التاريخ", "الوحدة", "البيان المختصر"],
      rows: buildLatestEntryReportRows(user, domainId, 10),
      emptyText: "لا توجد سجلات حديثة."
    },
    {
      title: "مهام مرتبطة بالقسم",
      headers: ["#", "المهمة", "القسم", "الحالة", "الاستحقاق", "الأولوية"],
      rows: buildTaskReportRows(domainTasks),
      emptyText: "لا توجد مهام مرتبطة بهذا القسم."
    },
    {
      title: "تنبيهات القسم",
      headers: ["#", "الوقت", "القسم", "التنبيه"],
      rows: buildAlertReportRows(domainAlerts),
      emptyText: "لا توجد تنبيهات حالية لهذا القسم."
    }
  ];

  if (domainId === "meaning") {
    sections.splice(2, 0, {
      title: "ملخص الزكاة والصدقات",
      headers: ["البند", "القيمة", "ملاحظة"],
      rows: buildZakatReportRows(user),
      emptyText: "لا توجد بيانات كافية لحساب الزكاة."
    });
  }

  return {
    id: domainId,
    title: domain.label,
    subject: `تقرير رسمي لقسم ${domain.label}`,
    metrics: [
      { label: "درجة القسم", value: `${summary.score}%` },
      { label: "عدد الوحدات", value: String(moduleGroups[domainId].length) },
      { label: "إجمالي السجلات", value: String(buildLatestEntryReportRows(user, domainId, 9999).length) },
      { label: "تنبيهات القسم", value: String(domainAlerts.length) }
    ],
    sections,
    aiNote: state.market.aiResponses[domainId] || localAIAnalysis(user, domainId)
  };
}

function buildFinanceOfficialReport(user) {
  const finance = getFinanceNumbers(user);
  const budget = getBudgetNumbers(user);
  const emergency = getEmergencyFundNumbers(user);
  const cashflow = getCashflowProjection(user);
  const work = getWorkNumbers(user);
  const lens = getAdvancedFinanceLens(user, finance, budget, emergency, cashflow);
  const actionPlan = buildFinanceActionPlan(finance, budget, emergency, cashflow, lens);
  const tabLabel = state.financeTab === "stats" ? "الإحصائيات المالية" : state.financeTab === "work" ? "العمل والوظائف" : "الماليات والتحليل";
  return {
    id: `finance-${state.financeTab || "money"}`,
    title: "المال والعمل",
    subject: `تقرير رسمي لقسم المال والعمل - ${tabLabel}`,
    metrics: [
      { label: "إجمالي الدخل", value: formatMoney(finance.income) },
      { label: "إجمالي المصاريف", value: formatMoney(finance.expenses) },
      { label: "صافي التدفق", value: formatMoney(finance.net) },
      { label: "مؤشر الصحة المالية", value: `${lens.healthScore}%` },
      { label: "صندوق الطوارئ", value: `${emergency.progress}%` },
      { label: "مهام العمل المفتوحة", value: String(work.openTasks) }
    ],
    sections: [
      {
        title: "البيان المالي التنفيذي",
        headers: ["البند", "القيمة", "التحليل الرسمي"],
        rows: [
          ["الدخل الشهري", formatMoney(finance.income), `مصادر الدخل المسجلة هذا الشهر: ${lens.incomeStreams.length || 0}`],
          ["المصاريف الشهرية", formatMoney(finance.expenses), `نسبة المصروفات إلى الدخل: ${lens.expenseRatio}%`],
          ["الصافي", formatMoney(finance.net), finance.net >= 0 ? "الوضع موجب ويصلح للتوزيع على الادخار والطوارئ." : "يوجد عجز يحتاج ضبطا فوريا."],
          ["الديون المفتوحة", formatMoney(finance.debts), `نسبة الديون إلى الدخل: ${lens.debtRatio}%`],
          ["الأصول الصافية", formatMoney(lens.netWorth), `الأصول المسجلة بعد خصم الديون.`],
          ["Runway السيولة", `${lens.runwayMonths} شهر`, "مدة تحمل السيولة الحالية مع نفس معدل الحرق."]
        ],
        emptyText: "لا توجد بيانات مالية كافية."
      },
      {
        title: "الميزانية والطوارئ",
        headers: ["المحور", "القيمة", "خلاصة المتابعة"],
        rows: [
          ["الميزانية المخططة", formatMoney(budget.planned), "إجمالي البنود المخططة للشهر الحالي."],
          ["المنصرف من الميزانية", formatMoney(budget.spent), "المنصرف المسجل مقابل الخطة."],
          ["المتبقي من الميزانية", formatMoney(budget.remaining), budget.remaining >= 0 ? "المتبقي داخل الحدود المخططة." : "تجاوز في الميزانية يستدعي إجراء تصحيحي."],
          ["هدف صندوق الطوارئ", formatMoney(emergency.target), `${emergency.targetMonths} شهر أمان.`],
          ["الفجوة في الطوارئ", formatMoney(lens.emergencyGap), `الاقتراح الشهري: ${formatMoney(lens.suggestedEmergencyContribution)}.`]
        ],
        emptyText: "لا توجد بيانات ميزانية."
      },
      {
        title: "مصادر الدخل والنفقات",
        headers: ["التصنيف", "البند", "القيمة", "الملاحظة"],
        rows: buildFinanceBreakdownRows(lens),
        emptyText: "لا توجد بنود دخل أو نفقات مفصلة."
      },
      {
        title: "اختبارات السيناريو المالي",
        headers: ["السيناريو", "الدخل", "المصاريف", "الصافي", "الفجوة", "الملاحظة"],
        rows: lens.scenarios.map((item) => [item.name, formatMoney(item.income), formatMoney(item.expenses), formatMoney(item.net), formatMoney(item.budgetGap), item.note]),
        emptyText: "لا توجد سيناريوهات."
      },
      {
        title: "سجل المخاطر المالية",
        headers: ["الخطر", "المستوى", "القيمة", "التفسير"],
        rows: lens.risks.map((item) => [item.title, item.level, item.value, item.detail]),
        emptyText: "لا توجد مخاطر ظاهرة."
      },
      {
        title: "خطة العمل المالية",
        headers: ["#", "الأولوية", "الإجراء", "التفصيل", "المدة", "المؤشر"],
        rows: actionPlan.map((item, index) => [index + 1, item.priorityLabel, item.title, item.detail, item.time, item.metric]),
        emptyText: "لا توجد خطة عمل حاليا."
      },
      {
        title: "وحدات المال والعمل",
        headers: ["الوحدة", "الوصف", "عدد السجلات", "آخر تحديث", "ملخص آخر سجل"],
        rows: buildModuleReportRows(user, "finance", moduleGroups.finance.filter((module) => module.category !== "planning")),
        emptyText: "لا توجد سجلات في المال والعمل."
      }
    ],
    aiNote: state.market.aiResponses[`finance-${state.financeTab || "money"}`] || state.market.aiResponses.finance || localAIAnalysis(user, "finance")
  };
}

function buildPrioritiesOfficialReport(user) {
  const tasks = getSortedTasks(user);
  const matrix = getPriorityMatrixSummary(tasks);
  return {
    id: "priorities",
    title: "الأولويات",
    subject: "تقرير رسمي للأولويات والمهام",
    metrics: priorityStats(user).map((item) => ({ label: item.label, value: item.value })),
    sections: [
      {
        title: "مصفوفة أيزنهاور",
        headers: ["الخانة", "عدد المهام", "القرار التنفيذي"],
        rows: matrix,
        emptyText: "لا توجد مهام مفتوحة."
      },
      {
        title: "سجل المهام",
        headers: ["#", "المهمة", "القسم", "الحالة", "الاستحقاق", "الأولوية"],
        rows: buildTaskReportRows(tasks.slice(0, 30)),
        emptyText: "لا توجد مهام مسجلة."
      }
    ],
    aiNote: localAIAnalysis(user, "planning")
  };
}

function buildPlanningOfficialReport(user) {
  const summaries = getAllDomainSummaries(user);
  const journals = user.data.planning.journals.slice().sort(sortNewest);
  const goals = user.data.planning.goals.slice().sort(sortNewest);
  const planningModules = moduleGroups.finance.filter((module) => module.category === "planning");
  return {
    id: "planning",
    title: "التخطيط",
    subject: "تقرير رسمي للتخطيط واليوميات والأهداف",
    metrics: [
      { label: "اليوميات", value: String(journals.length) },
      { label: "الأهداف", value: String(goals.length) },
      { label: "متوسط درجات الأقسام", value: `${average(Object.values(summaries).map((item) => item.score))}%` },
      { label: "مهام مفتوحة", value: String(getSortedTasks(user).filter((task) => task.status !== "done").length) }
    ],
    sections: [
      {
        title: "اليوميات والمذكرات",
        headers: ["التاريخ", "العنوان", "الحالة", "المحتوى المختصر"],
        rows: journals.slice(0, 12).map((entry) => [formatShortDate(entry.date), entry.title, entry.mood, entry.body]),
        emptyText: "لا توجد يوميات مسجلة."
      },
      {
        title: "الأهداف القريبة والبعيدة",
        headers: ["الهدف", "المدى", "التقدم", "التاريخ المستهدف", "خطة التنفيذ"],
        rows: goals.slice(0, 20).map((goal) => [goal.title, goal.horizon, `${goal.progress}%`, goal.deadline || "-", goal.plan || "-"]),
        emptyText: "لا توجد أهداف مسجلة."
      },
      {
        title: "تخطيط المال والعمل",
        headers: ["الوحدة", "الوصف", "عدد السجلات", "آخر تحديث", "ملخص آخر سجل"],
        rows: buildModuleReportRows(user, "finance", planningModules),
        emptyText: "لا توجد سجلات تخطيطية للمال والعمل."
      },
      {
        title: "درجات الأقسام",
        headers: ["القسم", "الدرجة", "المؤشرات الأساسية"],
        rows: buildScoreRows(summaries),
        emptyText: "لا توجد مؤشرات."
      }
    ],
    aiNote: state.market.aiResponses.planning || localAIAnalysis(user, "planning")
  };
}

function buildSettingsOfficialReport(user) {
  return {
    id: "settings",
    title: "الإعدادات",
    subject: "تقرير رسمي لبيانات المستخدم والأهداف",
    metrics: [
      { label: "اسم المستخدم", value: user.username },
      { label: "المدينة", value: user.profile.city || "-" },
      { label: "هدف المياه", value: `${formatNumber(user.settings.waterTarget || 0)} لتر` },
      { label: "هدف التعلم", value: `${formatNumber(user.settings.learningTarget || 0)} ساعة` }
    ],
    sections: [
      {
        title: "بيانات المستخدم",
        headers: ["الحقل", "القيمة", "ملاحظة"],
        rows: [
          ["الاسم", user.name, "بيان تعريفي"],
          ["اسم المستخدم", user.username, "حساب مستقل داخل النظام"],
          ["البريد الإلكتروني", user.email, "للتعريف والمتابعة"],
          ["جملة الترحيب", user.profile.subtitle || "-", "تظهر أعلى لوحة التحكم"],
          ["المدينة", user.profile.city || "-", "اختياري"],
          ["السن", user.profile.age || "-", "اختياري"],
          ["الطول", user.profile.height ? `${user.profile.height} سم` : "-", "اختياري"],
          ["الهدف الشخصي", user.profile.goal || "-", "مرجع عام للتخطيط"]
        ],
        emptyText: "لا توجد بيانات مستخدم."
      },
      {
        title: "الأهداف اليومية",
        headers: ["الهدف", "القيمة", "الغرض"],
        rows: [
          ["السعرات", formatNumber(user.settings.dailyCaloriesTarget || 0), "متابعة التغذية اليومية"],
          ["المياه", `${formatNumber(user.settings.waterTarget || 0)} لتر`, "متابعة الترطيب"],
          ["الخطوات", formatNumber(user.settings.stepsTarget || 0), "متابعة الحركة"],
          ["النوم", `${formatNumber(user.settings.sleepTarget || 0)} ساعة`, "متابعة التعافي"],
          ["التعلم", `${formatNumber(user.settings.learningTarget || 0)} ساعة`, "متابعة التطور"],
          ["الادخار", `${formatNumber(user.settings.savingsTargetRate || 0)}%`, "متابعة الانضباط المالي"]
        ],
        emptyText: "لا توجد أهداف."
      }
    ],
    aiNote: "هذا التقرير لا يعرض كلمات المرور أو أي بيانات دخول حساسة، ويكتفي بملخص آمن لبيانات المستخدم والأهداف."
  };
}

function buildOfficialReportHTML(user, scope) {
  const logoUrl = new URL("assets/wolf47-logo.png", location.href).href;
  const docNo = `LifeOS-${user.username}-${scope.id}-${todayISO()}`;
  return `<!DOCTYPE html>
  <html lang="ar" dir="rtl">
  <head>
    <meta charset="UTF-8">
    <title>${escapeHTML(scope.subject)} - Life OS</title>
    <style>
      @page{size:A4;margin:16mm}
      *{box-sizing:border-box}
      body{font-family:"Arial","Tahoma",sans-serif;color:#111;background:#fff;margin:0;line-height:1.65;font-size:12.2px;letter-spacing:0}
      .report{width:100%;max-width:190mm;margin:0 auto}
      .official-frame{border:2px solid #111;padding:10px 12px;margin-bottom:12px}
      .header{border-bottom:2px solid #111;padding-bottom:10px;margin-bottom:12px;display:grid;grid-template-columns:86px minmax(0,1fr) 132px;gap:16px;align-items:center}
      .logo{width:78px;height:78px;object-fit:contain;filter:grayscale(1)}
      h1{margin:0 0 5px;font-size:22px;letter-spacing:0}
      h2{font-size:15px;margin:18px 0 8px;border-bottom:1px solid #111;padding-bottom:4px;page-break-after:avoid}
      h3{margin:0 0 6px;font-size:13px}
      p{margin:0 0 5px}
      .meta{font-size:10.5px;text-align:left;direction:ltr;line-height:1.5}
      .subject{font-size:14px;font-weight:700}
      .summary{display:grid;grid-template-columns:repeat(3,1fr);gap:7px;margin:12px 0}
      .box{border:1px solid #222;padding:7px;min-height:46px;page-break-inside:avoid}
      .box span{display:block;font-size:10px;color:#333;margin-bottom:3px}
      .box b{font-size:14px;overflow-wrap:anywhere}
      .identity{display:grid;grid-template-columns:repeat(4,1fr);gap:0;border:1px solid #222;margin-bottom:12px}
      .identity div{border-left:1px solid #222;padding:6px 7px;min-height:38px}
      .identity div:last-child{border-left:0}
      .identity span{display:block;font-size:10px;color:#333}
      .identity b{display:block;font-size:12px;overflow-wrap:anywhere}
      table{width:100%;border-collapse:collapse;margin:8px 0 12px;page-break-inside:auto;table-layout:fixed}
      tr{page-break-inside:avoid}
      th,td{border:1px solid #222;padding:6px 7px;text-align:right;vertical-align:top;overflow-wrap:anywhere;word-break:break-word}
      th{font-weight:700;background:#f4f4f4}
      .note{border:1px solid #222;padding:10px;margin-top:10px;min-height:54px;overflow-wrap:anywhere}
      .official-note-title{font-weight:700;margin-bottom:5px}
      .signatures{display:grid;grid-template-columns:1fr 1fr 1fr;gap:16px;margin-top:26px}
      .signature{border-top:1px solid #111;padding-top:8px;text-align:center}
      .footer{border-top:1px solid #111;margin-top:18px;padding-top:8px;font-size:10px;text-align:center;color:#333}
      @media print{body{font-size:12px}.no-print{display:none}.report{max-width:none}}
    </style>
  </head>
  <body>
    <main class="report">
      <section class="official-frame">
        <div class="header">
          <img class="logo" src="${logoUrl}" alt="Wolf47">
          <div>
            <h1>تقرير متابعة Life OS</h1>
            <p class="subject">${escapeHTML(scope.subject)}</p>
            <p>تقرير نصي رسمي منسق للطباعة والحفظ PDF، بدون رسومات أو ألوان تشغيلية.</p>
          </div>
          <div class="meta">
            Document No: ${escapeHTML(docNo)}<br>
            Report Date: ${todayISO()}<br>
            Generated By: Life OS
          </div>
        </div>

        <div class="identity">
          <div><span>المستخدم</span><b>${escapeHTML(user.name)}</b></div>
          <div><span>اسم المستخدم</span><b>${escapeHTML(user.username)}</b></div>
          <div><span>الصفحة</span><b>${escapeHTML(scope.title)}</b></div>
          <div><span>تاريخ الإصدار</span><b>${escapeHTML(formatLongDate(new Date()))}</b></div>
        </div>
      </section>

      ${renderOfficialMetricGrid(scope.metrics)}
      ${scope.sections.map(renderOfficialSection).join("")}

      <h2>ملاحظات التقرير</h2>
      <div class="note"><div class="official-note-title">قراءة تحليلية مختصرة</div>${reportText(scope.aiNote || "لا توجد ملاحظات إضافية.")}</div>
      <div class="note">................................................................................................................................................................................................................................................................................................................................................</div>
      <div class="signatures">
        <div class="signature">مسؤول المراجعة</div>
        <div class="signature">توقيع المتابع</div>
        <div class="signature">توقيع المستخدم</div>
      </div>
      <div class="footer">تم إنشاء هذا التقرير آليا من بيانات المستخدم داخل Life OS. يعتمد التقرير على السجلات المدخلة حتى تاريخ الإصدار.</div>
    </main>
  </body>
  </html>`;
}

function renderOfficialMetricGrid(metrics = []) {
  if (!metrics.length) return "";
  return `
    <section class="summary">
      ${metrics.map((metric) => `
        <div class="box">
          <span>${escapeHTML(metric.label)}</span>
          <b>${escapeHTML(metric.value)}</b>
        </div>
      `).join("")}
    </section>
  `;
}

function renderOfficialSection(section) {
  if (section.note) {
    return `
      <section>
        <h2>${escapeHTML(section.title)}</h2>
        <div class="note">${reportText(section.note)}</div>
      </section>
    `;
  }
  return `
    <section>
      <h2>${escapeHTML(section.title)}</h2>
      ${renderOfficialTable(section.headers, section.rows, section.emptyText)}
    </section>
  `;
}

function renderOfficialTable(headers = [], rows = [], emptyText = "لا توجد بيانات.") {
  const safeRows = rows && rows.length ? rows : [[emptyText]];
  const colspan = Math.max(headers.length, 1);
  return `
    <table>
      ${headers.length ? `<thead><tr>${headers.map((header) => `<th>${escapeHTML(header)}</th>`).join("")}</tr></thead>` : ""}
      <tbody>
        ${rows && rows.length ? safeRows.map((row) => `
          <tr>${row.map((cell) => `<td>${reportText(cell)}</td>`).join("")}</tr>
        `).join("") : `<tr><td colspan="${colspan}">${escapeHTML(emptyText)}</td></tr>`}
      </tbody>
    </table>
  `;
}

function reportText(value) {
  return escapeHTML(value === undefined || value === null || value === "" ? "-" : value).replaceAll("\n", "<br>");
}

function buildScoreRows(summaries) {
  return Object.keys(domains).map((domainId) => [
    domains[domainId].label,
    `${summaries[domainId].score}%`,
    summaries[domainId].metrics.map((metric) => `${metric.label}: ${metric.value}`).join(" / ")
  ]);
}

function buildModuleReportRows(user, domainId, modules) {
  return modules.map((module) => {
    const entries = getEntries(user, domainId, module.id);
    const latest = entries.slice().sort(sortNewest)[0];
    return [
      module.label,
      module.desc,
      String(entries.length),
      latest ? formatShortDate(latest.date) : "لا يوجد",
      latest ? summarizeEntryForReport(latest, module) : "لا توجد مدخلات"
    ];
  });
}

function buildLatestEntryReportRows(user, domainId, limit = 10) {
  return moduleGroups[domainId]
    .flatMap((module) => getEntries(user, domainId, module.id).map((entry) => ({ entry, module })))
    .sort((a, b) => sortNewest(a.entry, b.entry))
    .slice(0, limit)
    .map(({ entry, module }) => [
      formatShortDate(entry.date),
      module.label,
      summarizeEntryForReport(entry, module)
    ]);
}

function summarizeEntryForReport(entry, module) {
  const parts = module.fields
    .filter((field) => field.type !== "file")
    .slice(0, 5)
    .map((field) => `${field.label}: ${formatFieldValue(entry.values[field.id], field)}`)
    .filter((part) => !part.endsWith(": -"));
  const fileCount = module.fields.filter((field) => field.type === "file" && entry.values[field.id]).length;
  if (fileCount) parts.push(`ملفات مرفقة: ${fileCount}`);
  return parts.length ? parts.join(" | ") : "سجل محفوظ بدون قيم مختصرة";
}

function buildTaskReportRows(tasks) {
  return tasks.map((task, index) => [
    index + 1,
    task.title,
    domains[task.domain]?.label || "الأولويات",
    getTaskStatusLabel(task.status),
    task.due || "-",
    `${getImportanceLabel(task.importance)} / ${getUrgencyLabel(task.urgency)}`
  ]);
}

function buildAlertReportRows(alerts) {
  return alerts.map((alert, index) => [
    index + 1,
    alert.time || "-",
    domains[alert.domain]?.label || "عام",
    alert.text
  ]);
}

function buildFinanceBreakdownRows(lens) {
  const incomeRows = lens.incomeStreams.slice(0, 6).map((item) => ["دخل", item.label, formatMoney(item.value), "مصدر دخل مسجل هذا الشهر"]);
  const expenseRows = lens.expenses.slice(0, 8).map((item) => ["نفقة", item.label, formatMoney(item.value), "بند صرف مجمع"]);
  const leakageRows = lens.leakage.slice(0, 5).map((item) => ["تحليل ضرورة", item.label, formatMoney(item.value), "تصنيف يساعد في ضبط الإنفاق"]);
  return [...incomeRows, ...expenseRows, ...leakageRows];
}

function buildZakatReportRows() {
  const gold = calculateGoldTools(false);
  return [
    ["كمية الذهب", `${formatNumber(state.market.goldGrams)} جرام عيار ${state.market.goldKarat}`, "حسب آخر قيمة مدخلة في حاسبة الزكاة"],
    ["قيمة الذهب", formatMoney(gold.goldValue), "قيمة تقديرية من السعر الحالي/الاحتياطي"],
    ["زكاة الذهب 2.5%", formatMoney(gold.goldZakat), "تقدير حسابي أولي"],
    ["مبلغ المال", formatMoney(state.market.zakatCash), "القيمة المدخلة لحساب زكاة المال"],
    ["زكاة المال 2.5%", formatMoney(gold.moneyZakat), "تقدير حسابي أولي"],
    ["جرام 21", formatMoney(gold.gram21), "سعر تقديري للسوق المصري"],
    ["الجنيه الذهب", formatMoney(gold.goldPound), "محسوب على 8 جرام عيار 21"]
  ];
}

function getPriorityMatrixSummary(tasks) {
  const open = tasks.filter((task) => task.status !== "done");
  const groups = [
    ["عاجل ومهم", open.filter((task) => task.importance === "high" && task.urgency === "urgent").length, "نفذه الآن"],
    ["مهم وغير عاجل", open.filter((task) => task.importance === "high" && task.urgency !== "urgent").length, "خطط له بموعد واضح"],
    ["عاجل وغير مهم", open.filter((task) => task.importance !== "high" && task.urgency === "urgent").length, "فوضه أو قلل وقته"],
    ["غير عاجل وغير مهم", open.filter((task) => task.importance !== "high" && task.urgency !== "urgent").length, "احذفه أو أجله"]
  ];
  return groups;
}

function getTaskStatusLabel(status) {
  return status === "done" ? "مكتملة" : status === "doing" ? "قيد التنفيذ" : "لم تبدأ";
}

function getImportanceLabel(value) {
  return value === "high" ? "مهمة" : "عادية";
}

function getUrgencyLabel(value) {
  return value === "urgent" ? "عاجلة" : "غير عاجلة";
}

function openPrintablePDF(html, fallbackFilename = `life-os-official-report-${todayISO()}.html`) {
  const win = window.open("", "_blank");
  if (!win) {
    downloadText(fallbackFilename, html, "text/html;charset=utf-8");
    return;
  }
  win.document.open();
  win.document.write(html);
  win.document.close();
  win.focus();
  setTimeout(() => win.print(), 500);
}

function exportDatabase() {
  downloadText(`life-os-database-${todayISO()}.json`, JSON.stringify(state.db, null, 2), "application/json;charset=utf-8");
  showToast("تم تصدير قاعدة البيانات.");
}

function exportUserCredentials() {
  const lines = [
    "Life OS - User Credentials",
    `Generated: ${formatLongDate(new Date())}`,
    "",
    "username,password"
  ];
  for (let i = 1; i <= SYSTEM_USER_COUNT; i += 1) {
    const credential = getSystemCredential(i);
    const user = Object.values(state.db.users).find((item) => item.username === credential.username);
    lines.push(`${credential.username},${user?.password || credential.password}`);
  }
  downloadText(`life-os-${SYSTEM_USER_COUNT}-users-${todayISO()}.csv`, lines.join("\n"), "text/csv;charset=utf-8");
  showToast("تم تصدير حسابات الدخول.");
}

function importDatabase(text) {
  try {
    const data = JSON.parse(text);
    if (!data.users || !data.userOrder) throw new Error("Invalid shape");
    state.db = data;
    saveDB();
    localStorage.setItem(SESSION_KEY, data.userOrder[0] || "");
    showToast("تم استيراد البيانات.");
    renderAuthOrApp();
  } catch (error) {
    showToast("ملف البيانات غير صالح.");
  }
}

async function initFirebaseCloud() {
  const firebaseSettings = window.lifeOSFirebase || {};
  state.firebase.enabled = Boolean(firebaseSettings.enabled);
  state.firebase.collection = firebaseSettings.collection || "life_os_users";
  if (!state.firebase.enabled) {
    state.firebase.status = "local";
    return;
  }
  try {
    const [{ initializeApp }, firestoreApi] = await Promise.all([
      import(`https://www.gstatic.com/firebasejs/${FIREBASE_SDK_VERSION}/firebase-app.js`),
      import(`https://www.gstatic.com/firebasejs/${FIREBASE_SDK_VERSION}/firebase-firestore.js`)
    ]);
    const app = initializeApp(firebaseSettings.config);
    const db = firestoreApi.getFirestore(app);
    state.firebase.ready = true;
    state.firebase.status = "connected";
    state.firebase.db = db;
    state.firebase.api = firestoreApi;
    const user = getCurrentUser();
    if (user) await pullFirebaseUser(user.id);
    showToast("Firebase متصل وجاهز للمزامنة.");
    renderPage();
  } catch (error) {
    console.warn("Firebase initialization failed", error);
    state.firebase.ready = false;
    state.firebase.status = "error";
    showToast("تعذر الاتصال بـ Firebase، سيتم استخدام التخزين المحلي.");
  }
}

function queueFirebaseSync() {
  if (!state.firebase?.ready) return;
  clearTimeout(queueFirebaseSync.timer);
  queueFirebaseSync.timer = setTimeout(() => {
    const user = getCurrentUser();
    if (user) pushFirebaseUser(user);
  }, 500);
}

async function pushFirebaseUser(user) {
  if (!state.firebase.ready || !state.firebase.api) return;
  try {
    const { doc, setDoc, serverTimestamp } = state.firebase.api;
    const ref = doc(state.firebase.db, state.firebase.collection, user.username);
    await setDoc(ref, {
      ...user,
      cloudUpdatedAt: serverTimestamp()
    }, { merge: true });
  } catch (error) {
    console.warn("Firebase sync failed", error);
  }
}

async function pullFirebaseUser(userId) {
  const user = state.db.users[userId];
  if (!user || !state.firebase.ready || !state.firebase.api) return;
  try {
    const { doc, getDoc } = state.firebase.api;
    const ref = doc(state.firebase.db, state.firebase.collection, user.username);
    const snapshot = await getDoc(ref);
    if (!snapshot.exists()) {
      await pushFirebaseUser(user);
      return;
    }
    const cloudUser = snapshot.data();
    if (cloudUser?.data) {
      state.db.users[userId] = { ...user, ...cloudUser, id: user.id };
      ensureUserShape(state.db.users[userId]);
      localStorage.setItem(DB_KEY, JSON.stringify(state.db));
      renderPage();
    }
  } catch (error) {
    console.warn("Firebase pull failed", error);
  }
}

function clearCurrentUserData() {
  const user = getCurrentUser();
  if (!user) return;
  if (!confirm("هل تريد مسح كل مدخلات هذا المستخدم؟")) return;
  user.data = {
    entries: createEmptyEntryBuckets(),
    tasks: [],
    habits: defaultHabits()
  };
  saveDB();
  showToast("تم مسح بيانات المستخدم.");
  renderPage();
}

function downloadText(filename, text, type) {
  const blob = new Blob([text], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function defaultAvatar(name) {
  const initials = escapeHTML((name || "U").trim().slice(0, 2) || "U");
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="160" height="160" viewBox="0 0 160 160">
      <rect width="160" height="160" rx="80" fill="#dff5f1"/>
      <circle cx="80" cy="62" r="30" fill="#2b2c75"/>
      <path d="M32 140c7-33 31-49 48-49s41 16 48 49" fill="#2b2c75"/>
      <text x="80" y="68" text-anchor="middle" font-family="Arial" font-size="24" font-weight="700" fill="#fff">${initials}</text>
    </svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function sortNewest(a, b) {
  return new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date);
}

function toNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
}

function clamp(value, min = 0, max = 100) {
  return Math.max(min, Math.min(max, value));
}

function ratioScore(value, target) {
  if (!target) return 0;
  return clamp((Number(value) / Number(target)) * 100);
}

function average(values) {
  const valid = values.filter((value) => Number.isFinite(Number(value)));
  if (!valid.length) return 0;
  return Math.round(valid.reduce((total, value) => total + Number(value), 0) / valid.length);
}

function uniqueRecentDays(entries, days) {
  const min = new Date();
  min.setDate(min.getDate() - days + 1);
  const set = new Set(entries.filter((entry) => new Date(entry.date) >= min).map((entry) => entry.date));
  return set.size;
}

function formatNumber(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) return String(value);
  return new Intl.NumberFormat("ar-EG", { maximumFractionDigits: 1 }).format(number);
}

function formatCompact(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) return "0";
  return new Intl.NumberFormat("ar-EG", { notation: "compact", maximumFractionDigits: 1 }).format(number);
}

function formatMoney(value) {
  return `${formatNumber(value)} ج`;
}

function formatShortDate(value) {
  if (!value) return "";
  return new Intl.DateTimeFormat("ar-EG", { day: "2-digit", month: "short" }).format(new Date(`${value}T00:00:00`));
}

function formatLongDate(date) {
  return new Intl.DateTimeFormat("ar-EG", { weekday: "long", day: "numeric", month: "long", year: "numeric" }).format(date);
}

function formatFieldValue(value, field) {
  if (value === undefined || value === null || value === "") return "-";
  if (field.type === "file") {
    return value?.name ? `${value.name} (${formatFileSize(value.size)})` : "-";
  }
  if (field.type === "number") return `${formatNumber(value)}${field.unit ? ` ${field.unit}` : ""}`;
  return String(value);
}

function readFileAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve({
      name: file.name,
      type: file.type,
      size: file.size,
      dataUrl: String(reader.result)
    });
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function formatFileSize(bytes) {
  const size = Number(bytes) || 0;
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${Math.round(size / 1024)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

function renderEmpty(text) {
  return `<div class="empty-state">${escapeHTML(text)}</div>`;
}

function escapeHTML(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function escapeAttr(value) {
  return escapeHTML(value);
}

function showToast(message) {
  elements.toast.textContent = message;
  elements.toast.classList.remove("hidden");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => elements.toast.classList.add("hidden"), 3200);
}

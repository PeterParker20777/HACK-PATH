/* Course categories shown on the homepage. A course joins one with: group: "<id>" */
const CATEGORIES = [
  { id: "pentest", icon: "⌘", symbol: "PT", code: "nmap -sV target",
    title: { en: "PENETRATION TESTER", ar: "مختبر الاختراق" },
    desc: { en: "Learn how attackers think and how to test systems the right way.", ar: "اتعلم إزاي المخترق بيفكر وإزاي تختبر الأنظمة بالطريقة الصحيحة." } },
  { id: "source-review", icon: "{ }", symbol: "SR", code: "grep -rn eval src/",
    title: { en: "SOURCE CODE REVIEW", ar: "مراجعة الكود المصدري" },
    desc: { en: "Read code like an auditor and find security flaws before attackers do.", ar: "اقرأ الكود زي المراجع الأمني ودوّر على الثغرات قبل المهاجمين." } },
  { id: "hacking-code", icon: "</>", symbol: "HC", code: "payload = build()",
    title: { en: "HACKING CODE", ar: "كود الهاكينج" },
    desc: { en: "Write your own scripts and tools to automate security tasks.", ar: "اكتب سكريبتاتك وأدواتك بنفسك عشان تأتمت مهام الأمن السيبراني." } }
];

/* Courses data: add or edit courses here (type: "free" | "paid") */
const COURSES = [
  {
    id: "python-basics", group: "hacking-code", icon: "{ }", symbol: "Py", code: 'print("Hello World")', type: "paid",
    category: { en: "PROGRAMMING", ar: "برمجة" },
    level: { en: "Beginner", ar: "مبتدئ" },
    title: { en: "PYTHON BASICS", ar: "أساسيات بايثون" },
    desc: { en: "Learn the fundamentals of Python and write your first programs step by step.", ar: "اتعلم أساسيات Python وابدأ تكتب أول برامجك خطوة بخطوة." },
    modules: [
      { en: "Variables and data types", ar: "المتغيرات وأنواع البيانات" },
      { en: "Conditions and loops", ar: "الشروط والتكرار" },
      { en: "Functions", ar: "الدوال" },
      { en: "Lists and dictionaries", ar: "القوائم والقواميس" },
      { en: "Files and error handling", ar: "الملفات ومعالجة الأخطاء" },
      { en: "Mini projects", ar: "مشاريع صغيرة" }
    ],
    learn: [
      { en: "Write and run Python programs on your own", ar: "تكتب وتشغّل برامج بايثون بنفسك" },
      { en: "Think like a programmer and solve problems", ar: "تفكر زي المبرمج وتحل المشاكل" },
      { en: "Build a base for cybersecurity scripting", ar: "تبني أساس لكتابة سكريبتات الأمن السيبراني" }
    ]
  },
  {
    id: "cyber-basics", group: "pentest", icon: "⌁", symbol: "⌘", code: "ACCESS_GRANTED();", type: "free", featured: true,
    category: { en: "CYBERSECURITY", ar: "الأمن السيبراني" },
    level: { en: "Beginner", ar: "مبتدئ" },
    title: { en: "BASICS OF CYBER SECURITY", ar: "أساسيات الأمن السيبراني" },
    desc: { en: "The fundamentals you need before anything else in cybersecurity: networks, Linux, encryption and the web.", ar: "الأساسيات اللي محتاجها قبل أي حاجة في الأمن السيبراني: الشبكات ولينكس والتشفير والويب." },
    modules: [
      { en: "Networking Basics", ar: "أساسيات الشبكات" },
      { en: "Linux", ar: "لينكس" },
      { en: "Cryptography", ar: "التشفير" },
      { en: "Web Basics", ar: "أساسيات الويب" }
    ],
    learn: [
      { en: "How networks and the internet really work", ar: "إزاي الشبكات والإنترنت بتشتغل فعلاً" },
      { en: "Work comfortably in the Linux terminal", ar: "تتعامل بسهولة مع الـ Terminal في لينكس" },
      { en: "Understand hashing and encryption", ar: "تفهم الـ Hashing والتشفير" }
    ]
  },
  {
    id: "web-pentest", group: "pentest", icon: "⌘", symbol: "</>", code: "GET /login HTTP/1.1", type: "paid",
    category: { en: "CYBERSECURITY", ar: "الأمن السيبراني" },
    level: { en: "Intermediate", ar: "متوسط" },
    title: { en: "WEB APPLICATION PENETRATION TESTING", ar: "اختبار اختراق تطبيقات الويب" },
    desc: { en: "Learn how web applications are tested for weaknesses, using legal labs and responsible disclosure only.", ar: "اتعلم إزاي بتتفحص تطبيقات الويب لاكتشاف الثغرات، باستخدام معامل قانونية والإفصاح المسؤول فقط." },
    modules: [
      { en: "Web security and HTTP technologies", ar: "أمن الويب وتقنيات HTTP" },
      { en: "Testing methodology", ar: "منهجية الاختبار" },
      { en: "Authentication and authorization", ar: "المصادقة والصلاحيات" },
      { en: "Input validation and common vulnerabilities", ar: "فحص المدخلات والثغرات الشائعة" },
      { en: "Security testing tools and practical labs", ar: "أدوات الفحص والمعامل العملية" },
      { en: "Reporting and documentation", ar: "كتابة التقارير والتوثيق" }
    ],
    learn: [
      { en: "Analyze web vulnerabilities in authorized environments", ar: "تحلل ثغرات الويب في بيئات مصرّح بها" },
      { en: "Follow a professional testing methodology", ar: "تتبع منهجية اختبار احترافية" },
      { en: "Write clear security reports", ar: "تكتب تقارير أمنية واضحة" }
    ]
  }
];

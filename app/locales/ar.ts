export default {
  search: 'البحث',
  browse: 'استعرض',
  searchOrTypeCommand: 'ابحث أو اكتب أمرًا...',
  home: 'الرئيسية',
  dashboard: 'لوحة التحكم',
  signIn: 'تسجيل الدخول',
  signInSubtitle: 'أدخل بريدك الإلكتروني وكلمة المرور لتسجيل الدخول!',
  pagination: {
    page: 'الصفحة',
    of: 'من',
    Rows_per_page: 'عدد الصفوف في الصفحة',
    next: 'التالى',
    previous: 'السابق'
  },
  validation: {
    required: 'هذا الحقل مطلوب',
    email: 'يرجى إدخال بريد إلكتروني صالح',
    minLength: 'يجب ألا يقل عن {n} أحرف',
    maxLength: 'يجب ألا يزيد عن {n} أحرف',
    pattern: 'تنسيق غير صالح',
    phoneDigits: 'يرجى إدخال رقم هاتف صالح',
    asyncUnique: 'هذا الإدخال مستخدم بالفعل',
    maxFiles: 'يمكنك رفع حتى {limit} ملف(ات)',
    maxFileSize: 'يجب ألا يزيد حجم كل ملف عن {limitMB} ميغابايت'
  },
  formElements: {
    pageTitle: 'عناصر النموذج',
    home: 'الرئيسية',
    passwordLabel: 'كلمة المرور *',
    passwordPlaceholder: 'أدخل كلمة المرور',
    emailLable: 'البريد الإلكترونى',
    companySizeLabel: 'حجم الشركة *',
    companySizePlaceholder: '—',

    skillsLabel: 'المهارات *',
    skillsPlaceholder: 'اختر المهارات',

    attachmentsLabel: 'المرفقات *',
    attachmentsPlaceholder: 'أرفق الملفات الداعمة',
    noFileChosen: 'لم يتم اختيار أي ملف',
    chooseFile: 'اختر ملف',

    notificationsLabel: 'الإشعارات',

    copyTextLabel: 'نص النسخ',
    copy: 'نسخ',

    startDateLabel: 'تاريخ البدء *',
    startDatePlaceholder: 'اختر تاريخ البدء',

    endDateLabel: 'تاريخ الانتهاء',
    endDatePlaceholder: 'اختر تاريخ الانتهاء',

    meetingTimeLabel: 'وقت الاجتماع',
    meetingTimePlaceholder: 'اختر الوقت',

    dateRangeLabel: 'نطاق التاريخ',
    dateRangePlaceholder: 'اختر نطاق التاريخ',

    notesLabel: 'ملاحظات',
    notesPlaceholder: 'أضف أي ملاحظات',

    eventPhotosLabel: 'صور الحدث',
    dropzonePlaceholder: 'اسحب وأفلت الملفات هنا',
    dropzoneHint: 'قم بإفلات ملفات PNG أو JPG أو WebP أو SVG…',

    forgotPassword: 'هل نسيت كلمة المرور؟',

    enabled: 'مفعل',
    disabled: 'غير مفعل',
    keepMeLoggedIn: 'تذكرني',
    eventPhotosLabel: 'صور الحدث',
    dropzonePlaceholder: 'اسحب وأفلت الملفات هنا',
    browse: 'تصفح',
    dropzoneHint: 'قم بإفلات ملفات PNG أو JPG أو WebP أو SVG '
  },
  error: {
    404: { title: 'الصفحة غير موجودة', desc: 'تعذّر العثور على الصفحة المطلوبة.' },
    401: { title: 'يلزم تسجيل الدخول', desc: 'هذه الصفحة تتطلب مصادقة.' },
    403: { title: 'تم رفض الوصول', desc: 'ليست لديك صلاحية لعرض هذه الصفحة.' },
    '4xx': { title: 'حدث خطأ ما', desc: 'حدثت مشكلة في طلبك.' },
    '5xx': { title: 'خطأ في الخادم', desc: 'المشكلة من جهتنا. حاول مرة أخرى بعد قليل.' },
    default: { title: 'خطأ غير متوقع', desc: 'حدث خطأ غير متوقع.' },
    actions: { home: 'العودة إلى الرئيسية', clear: 'مسح الأخطاء' },
    debug: 'تفاصيل التصحيح'
  }
}

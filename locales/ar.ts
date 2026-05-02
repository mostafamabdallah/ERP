export type Translations = {
  nav: {
    menu: string;
    dashboard: string;
    customers: string;
    orders: string;
    employees: string;
    expenses: string;
    expenseTypes: string;
    items: string;
    categories: string;
    dailyPrices: string;
    dailyStats: string;
  };
  common: {
    addNew: string;
    submit: string;
    reset: string;
    search: string;
    id: string;
    name: string;
    phone: string;
    address: string;
    status: string;
    date: string;
    vsLast: string;
    validNumber: string;
    phoneError: string;
  };
  dashboard: {
    totalOrders: string;
    totalExpenses: string;
    totalDeliveryMoney: string;
    netProfit: string;
    week: string;
    ordersChart: string;
    ordersPerDay: string;
    moneyPerDay: string;
    moneyPerDayDataset: string;
    ordersPerHour: string;
    ordersPerHourDataset: string;
    top10Customers: string;
    type: string;
    orders: string;
    monthlyFinancials: string;
    grossProfit: string;
    revenue: string;
    expensesByCategory: string;
  };
  customers: {
    totalCustomers: string;
    verifiedCustomers: string;
    warnedCustomers: string;
    blockedCustomers: string;
    fullName: string;
    fullAddress: string;
    phoneNumber: string;
    gender: string;
    selectGender: string;
    male: string;
    female: string;
    pharmacy: string;
    superMarket: string;
    restaurant: string;
    vegetables: string;
    privateBusiness: string;
    cleaningService: string;
    butcher: string;
    others: string;
    selectGenderError: string;
    addedSuccess: string;
    updatedSuccess: string;
    totalOrders: string;
    deliveredOrders: string;
    failedOrders: string;
    verified: string;
    warned: string;
    blocked: string;
    orders: string;
  };
  orders: {
    totalOrders: string;
    deliveredOrders: string;
    pendingOrders: string;
    failedOrders: string;
    customerName: string;
    deliveryCost: string;
    deliveryMan: string;
    view: string;
    delete: string;
    confirmTitle: string;
    confirmContent: string;
    pending: string;
    delivered: string;
    collected: string;
    failed: string;
    success: string;
    moneyCollected: string;
    missingItem: string;
    selectItem: string;
    quantity: string;
    deliveryCostPlaceholder: string;
    orderDetails: string;
    deliveryManPlaceholder: string;
    addItem: string;
    createNewItem: string;
    itemPrice: string;
    priceUpdated: string;
  };
  employees: {
    fullName: string;
    phoneNumber: string;
    position: string;
    selectPosition: string;
    deliveryMan: string;
    manager: string;
    callCenter: string;
    selectPositionError: string;
    addedSuccess: string;
    job: string;
    jobDelivery: string;
    jobManager: string;
    jobCallCenter: string;
    nationalId: string;
    nationalIdPlaceholder: string;
    viewProfile: string;
    profile: string;
    totalOrders: string;
    deliveredOrders: string;
    failedOrders: string;
    pendingOrders: string;
    totalDeliveryMoney: string;
    successRate: string;
    avgDeliveryMoney: string;
    performance: string;
    excellent: string;
    good: string;
    average: string;
    poor: string;
    monthlyOrders: string;
    avgOrdersPerDay: string;
    allTime: string;
    commission: string;
    commissionEarnings: string;
    dailyDashboard: string;
    dailyOrders: string;
    dailyStats: string;
    selectDate: string;
    myEarningsToday: string;
  };
  expenses: {
    expenseType: string;
    expenseAmount: string;
    expenseDescription: string;
    selectUnit: string;
    selectUnitError: string;
    addedSuccess: string;
    salaries: string;
    gasoline: string;
    advertising: string;
    maintenance: string;
    capital: string;
    other: string;
    type: string;
    amount: string;
    description: string;
  };
  items: {
    id: string;
    name: string;
    price: string;
    category: string;
    quantity: string;
    unit: string;
    itemName: string;
    itemPrice: string;
    itemQuantity: string;
    itemUnit: string;
    selectCategory: string;
    selectCategoryError: string;
    selectUnitError: string;
    addedSuccess: string;
    kilo: string;
    box: string;
    carton: string;
    bottle: string;
    bag: string;
    unitOption: string;
    selectItemUnit: string;
    selectItemCategory: string;
  };
  categories: {
    id: string;
    name: string;
    categoryName: string;
    addedSuccess: string;
  };
  expenseTypes: {
    pageTitle: string;
    addNew: string;
    nameAr: string;
    nameEn: string;
    nameArPlaceholder: string;
    nameEnPlaceholder: string;
    nameArRequired: string;
    nameEnRequired: string;
    addedSuccess: string;
    addError: string;
    deletedSuccess: string;
    deleteError: string;
    confirmDeleteTitle: string;
    confirmDeleteContent: string;
    loading: string;
    empty: string;
  };
};

const ar: Translations = {
  nav: {
    menu: "القائمة",
    dashboard: "الرئيسية",
    customers: "العملاء",
    orders: "الطلبات",
    employees: "الموظفون",
    expenses: "المصروفات",
    expenseTypes: "أنواع المصروفات",
    items: "المنتجات",
    categories: "الأقسام",
    dailyPrices: "أسعار اليوم",
    dailyStats: "إحصائيات يومية",
  },
  common: {
    addNew: "إضافة جديد",
    submit: "حفظ",
    reset: "إعادة تعيين",
    search: "بحث",
    id: "الرقم",
    name: "الاسم",
    phone: "الهاتف",
    address: "العنوان",
    status: "الحالة",
    date: "التاريخ",
    vsLast: "مقارنة بآخر",
    validNumber: "الرجاء إدخال رقم صحيح",
    phoneError: "الرجاء إدخال رقم هاتف صحيح (11 رقم).",
  },
  dashboard: {
    totalOrders: "إجمالي الطلبات",
    totalExpenses: "إجمالي المصروفات",
    totalDeliveryMoney: "إجمالي الإيرادات",
    netProfit: "صافي الربح",
    week: "أسبوع",
    ordersChart: "الطلبات",
    ordersPerDay: "الطلبات اليومية",
    moneyPerDay: "الإيرادات اليومية",
    moneyPerDayDataset: "الإيرادات اليومية",
    ordersPerHour: "الطلبات بالساعة",
    ordersPerHourDataset: "الطلبات بالساعة",
    top10Customers: "أفضل 10 عملاء",
    type: "النوع",
    orders: "الطلبات",
    monthlyFinancials: "المالية الشهرية",
    grossProfit: "الربح الإجمالي",
    revenue: "الإيرادات",
    expensesByCategory: "تصنيف المصروفات",
  },
  customers: {
    totalCustomers: "إجمالي العملاء",
    verifiedCustomers: "العملاء الموثقون",
    warnedCustomers: "العملاء المحذرون",
    blockedCustomers: "العملاء المحظورون",
    fullName: "الاسم الكامل",
    fullAddress: "العنوان الكامل",
    phoneNumber: "رقم الهاتف",
    gender: "النوع",
    selectGender: "اختر النوع",
    male: "ذكر",
    female: "أنثى",
    pharmacy: "صيدلية",
    superMarket: "سوبر ماركت",
    restaurant: "مطعم",
    vegetables: "سوق خضروات",
    privateBusiness: "عمل خاص",
    cleaningService: "خدمة نظافة",
    butcher: "جزارة",
    others: "أخرى",
    selectGenderError: "الرجاء اختيار النوع!",
    addedSuccess: "تم إضافة العميل بنجاح",
    updatedSuccess: "تم تحديث العميل بنجاح",
    totalOrders: "إجمالي الطلبات",
    deliveredOrders: "الطلبات المسلمة",
    failedOrders: "الطلبات الفاشلة",
    verified: "موثق",
    warned: "محذر",
    blocked: "محظور",
    orders: "الطلبات",
  },
  orders: {
    totalOrders: "إجمالي الطلبات",
    deliveredOrders: "الطلبات المسلمة",
    pendingOrders: "الطلبات المعلقة",
    failedOrders: "الطلبات الفاشلة",
    customerName: "اسم العميل",
    deliveryCost: "تكلفة التوصيل",
    deliveryMan: "المندوب",
    view: "عرض",
    delete: "حذف",
    confirmTitle: "تأكيد الحذف",
    confirmContent: "هل تريد حذف هذا الطلب؟",
    pending: "معلق",
    delivered: "مسلّم",
    collected: "محصّل",
    failed: "فاشل",
    success: "مسلّم",
    moneyCollected: "محصّل",
    missingItem: "الصنف مفقود",
    selectItem: "اختر صنفاً",
    quantity: "الكمية",
    deliveryCostPlaceholder: "تكلفة التوصيل",
    orderDetails: "تفاصيل الطلب",
    deliveryManPlaceholder: "المندوب",
    addItem: "إضافة صنف",
    createNewItem: "إنشاء صنف جديد",
    itemPrice: "السعر",
    priceUpdated: "تم تحديث السعر",
  },
  employees: {
    fullName: "الاسم الكامل",
    phoneNumber: "رقم الهاتف",
    position: "المنصب",
    selectPosition: "اختر المنصب",
    deliveryMan: "مندوب توصيل",
    manager: "مدير",
    callCenter: "مركز اتصال",
    selectPositionError: "الرجاء اختيار المنصب!",
    addedSuccess: "تم إضافة الموظف بنجاح",
    job: "الوظيفة",
    jobDelivery: "مندوب توصيل",
    jobManager: "مدير",
    jobCallCenter: "مركز اتصال",
    nationalId: "الرقم القومي",
    nationalIdPlaceholder: "أدخل الرقم القومي",
    viewProfile: "عرض الملف",
    profile: "ملف الموظف",
    totalOrders: "إجمالي الطلبات",
    deliveredOrders: "الطلبات المسلمة",
    failedOrders: "الطلبات الفاشلة",
    pendingOrders: "الطلبات المعلقة",
    totalDeliveryMoney: "إجمالي التوصيل",
    successRate: "نسبة النجاح",
    avgDeliveryMoney: "متوسط سعر التوصيل",
    performance: "الأداء",
    excellent: "ممتاز",
    good: "جيد",
    average: "متوسط",
    poor: "ضعيف",
    monthlyOrders: "طلبات الشهر",
    avgOrdersPerDay: "متوسط التسليم اليومي",
    allTime: "كل الوقت",
    commission: "نسبة العمولة",
    commissionEarnings: "أرباح العمولة",
    dailyDashboard: "لوحة اليومية",
    dailyOrders: "طلبات اليوم",
    dailyStats: "إحصائيات يومية للمندوب",
    selectDate: "اختر التاريخ",
    myEarningsToday: "أرباحي اليوم",
  },
  expenses: {
    expenseType: "نوع المصروف",
    expenseAmount: "المبلغ",
    expenseDescription: "الوصف",
    selectUnit: "اختر النوع",
    selectUnitError: "الرجاء اختيار النوع!",
    addedSuccess: "تم إضافة المصروف بنجاح",
    salaries: "مرتبات و اجور",
    gasoline: "بنزين",
    advertising: "دعاية و إعلان",
    maintenance: "تصليح",
    capital: "رأس مال",
    other: "أخرى",
    type: "النوع",
    amount: "المبلغ",
    description: "الوصف",
  },
  items: {
    id: "الرقم",
    name: "الاسم",
    price: "السعر",
    category: "الفئة",
    quantity: "الكمية",
    unit: "الوحدة",
    itemName: "اسم الصنف",
    itemPrice: "سعر الصنف",
    itemQuantity: "كمية الصنف",
    itemUnit: "وحدة الصنف",
    selectCategory: "اختر الفئة",
    selectCategoryError: "الرجاء اختيار الفئة!",
    selectUnitError: "الرجاء اختيار الوحدة!",
    addedSuccess: "تم إضافة الصنف بنجاح",
    kilo: "كيلو",
    box: "علبة",
    carton: "كرتونة",
    bottle: "زجاجة",
    bag: "كيس",
    unitOption: "وحدة",
    selectItemUnit: "اختر الوحدة",
    selectItemCategory: "اختر الفئة",
  },
  categories: {
    id: "الرقم",
    name: "الاسم",
    categoryName: "اسم الفئة",
    addedSuccess: "تمت الإضافة بنجاح",
  },
  expenseTypes: {
    pageTitle: "أنواع المصروفات",
    addNew: "إضافة نوع جديد",
    nameAr: "الاسم بالعربية",
    nameEn: "الاسم بالإنجليزية",
    nameArPlaceholder: "مثال: بنزين",
    nameEnPlaceholder: "e.g. Gasoline",
    nameArRequired: "الرجاء إدخال الاسم بالعربية",
    nameEnRequired: "الرجاء إدخال الاسم بالإنجليزية",
    addedSuccess: "تم إضافة النوع بنجاح",
    addError: "حدث خطأ أثناء الإضافة",
    deletedSuccess: "تم حذف النوع بنجاح",
    deleteError: "حدث خطأ أثناء الحذف",
    confirmDeleteTitle: "تأكيد الحذف",
    confirmDeleteContent: "هل تريد حذف هذا النوع؟",
    loading: "جاري التحميل...",
    empty: "لا توجد أنواع مضافة بعد",
  },
};

export default ar;

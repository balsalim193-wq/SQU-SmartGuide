export interface IndoorDirections {
  entrance: string;
  floorLevel: string; // e.g. "الطابق الأرضي (Ground Floor)", "الطابق الأول (1st Floor)"
  steps: string[];
  landmarks: string[];
  hasElevator: boolean;
  wheelchairAccessible: boolean;
  nearestRestroom?: string;
  nearestPrayerRoom?: string;
}

export type LocationCategory = 
  | 'college' 
  | 'hall' 
  | 'library' 
  | 'dining' 
  | 'hospital' 
  | 'service' 
  | 'sports' 
  | 'bus' 
  | 'gate'
  | 'lounge'
  | 'store';

export interface CampusLocation {
  id: string;
  name: string;
  nameEn: string;
  code?: string;
  category: LocationCategory;
  parentBuildingId?: string;
  parentBuildingName?: string;
  coordinates?: [number, number]; // [lat, lng]
  hasMapPin?: boolean; // if false: descriptive indoor only, no map pin
  floor?: string;
  wing?: string;
  indoorDirections?: IndoorDirections;
  workingHours?: string;
  description: string;
  tags: string[];
  phone?: string;
  isPopular?: boolean;
  badge?: string;
}

export interface RouteDirection {
  title: string;
  stops: string[];
}

export interface BusRoute {
  id: string;
  name: string;
  nameEn: string;
  color: string;
  operatingHours: string;
  frequency: string;
  description: string;
  femaleRoute: {
    direct: RouteDirection;
    reverse?: RouteDirection;
    commercialNote?: string;
  };
  maleRoute: {
    direct: RouteDirection;
    commercialNote?: string;
  };
}

// Coordinates for SQU Campus (Al Khoudh, Muscat, Oman)
// Center around 23.5908, 58.1722
export const SQU_CENTER: [number, number] = [23.5908, 58.1722];

export const SQU_LOCATIONS: CampusLocation[] = [
  // =================== الكليات (COLLEGES) ===================
  {
    id: 'col_engineering',
    name: 'كلية الهندسة',
    nameEn: 'College of Engineering',
    code: 'ENG',
    category: 'college',
    coordinates: [23.5932, 58.1705],
    description: 'تضم أقسام الهندسة المدنية، الميكانيكية، الكهربائية، الكيميائية، وهندسة النفط، وقاعات المحاضرات والمختبرات التقنية.',
    workingHours: '07:30 ص - 04:30 م (الأحد - الخميس)',
    tags: ['هندسة', 'engineering', 'مختبرات', 'ورش', 'مدرج', 'قاعات'],
    isPopular: true,
    badge: 'كليات العلوم التطبيقية',
    phone: '2414 1300'
  },
  {
    id: 'col_science',
    name: 'كلية العلوم',
    nameEn: 'College of Science',
    code: 'SCI',
    category: 'college',
    coordinates: [23.5918, 58.1695],
    description: 'تضم أقسام علوم الحاسب الآلي، الرياضيات، الفيزياء، الكيمياء، الأحياء، وعلوم الأرض، ومدرج الفراهيدي الشهير.',
    workingHours: '07:30 ص - 04:30 م',
    tags: ['علوم', 'science', 'حاسب', 'كمبيوتر', 'رياضيات', 'فيزياء', 'كيمياء', 'فراهيدي'],
    isPopular: true,
    badge: 'كليات العلوم التطبيقية',
    phone: '2414 1400'
  },
  {
    id: 'col_ceps',
    name: 'كلية الاقتصاد والعلوم السياسية',
    nameEn: 'College of Economics & Political Science',
    code: 'CEPS',
    category: 'college',
    coordinates: [23.5898, 58.1698],
    description: 'تضم تخصصات إدارة الأعمال، المحاسبة، المالية، التسويق، الاقتصاد، والعلوم السياسية، مع قاعة التداول المالي والمدرج الرئيسي.',
    workingHours: '07:30 ص - 04:30 م',
    tags: ['تجارة', 'اقتصاد', 'سياسة', 'ceps', 'إدارة', 'محاسبة', 'مالية'],
    isPopular: true,
    badge: 'العلوم الاجتماعية والإنسانية',
    phone: '2414 1800'
  },
  {
    id: 'col_arts',
    name: 'كلية الآداب والعلوم الاجتماعية',
    nameEn: 'College of Arts & Social Sciences',
    code: 'ARTS',
    category: 'college',
    coordinates: [23.5878, 58.1710],
    description: 'تضم أقسام اللغة العربية، الإنجليزية، التاريخ، الجغرافيا، علم الاجتماع، الإعلام، ودراسات المعلومات وقاعة ابن خلدون.',
    workingHours: '07:30 ص - 04:30 م',
    tags: ['آداب', 'لغات', 'إعلام', 'تاريخ', 'جغرافيا', 'اجتماع', 'arts'],
    isPopular: true,
    badge: 'العلوم الاجتماعية والإنسانية',
    phone: '2414 1600'
  },
  {
    id: 'col_medicine',
    name: 'كلية الطب والعلوم الصحية',
    nameEn: 'College of Medicine & Health Sciences',
    code: 'MED',
    category: 'college',
    coordinates: [23.5945, 58.1748],
    description: 'إحدى أعرق الكليات الطبية في السلطنة متصلة بمستشفى الجامعة، وتضم قاعات التدريب السريري ومختبرات التشريح والمحاكاة الطبية.',
    workingHours: '07:30 ص - 05:00 م',
    tags: ['طب', 'صحة', 'medicine', 'تدريب سريري', 'تشريح'],
    isPopular: true,
    badge: 'القطاع الطبي',
    phone: '2414 1100'
  },
  {
    id: 'col_nursing',
    name: 'كلية التمريض',
    nameEn: 'College of Nursing',
    code: 'NURS',
    category: 'college',
    coordinates: [23.5940, 58.1762],
    description: 'مبنى كلية التمريض الحديث المزود بمختبرات مهارات المحاكاة التمريضية بالقرب من المجمع الطبي والمستشفى الجامعي.',
    workingHours: '07:30 ص - 04:00 م',
    tags: ['تمريض', 'nursing', 'صحة'],
    badge: 'القطاع الطبي'
  },
  {
    id: 'col_education',
    name: 'كلية التربية',
    nameEn: 'College of Education',
    code: 'EDU',
    category: 'college',
    coordinates: [23.5885, 58.1725],
    description: 'تُعنى بإعداد المعلمين والكوادر التربوية وتضم مناهج وطرق التدريس، التربية الخاصة، والإرشاد النفسي ومدرجات واسعة.',
    workingHours: '07:30 ص - 04:30 م',
    tags: ['تربية', 'تعليم', 'معلمين', 'نفس', 'education'],
    badge: 'العلوم الاجتماعية والتربوية'
  },
  {
    id: 'col_law',
    name: 'كلية الحقوق',
    nameEn: 'College of Law',
    code: 'LAW',
    category: 'college',
    coordinates: [23.5855, 58.1712],
    description: 'تضم تخصصات القانون العام والقانون الخاص وقاعة المحكمة الصورية للتدريب العملي للمحاماة والادعاء العام.',
    workingHours: '07:30 ص - 04:00 م',
    tags: ['حقوق', 'قانون', 'محكمة صورية', 'محاماة', 'law'],
    badge: 'العلوم القانونية'
  },
  {
    id: 'col_cams',
    name: 'كلية العلوم الزراعية والبحرية',
    nameEn: 'College of Agricultural & Marine Sciences',
    code: 'CAMS',
    category: 'college',
    coordinates: [23.5865, 58.1728],
    description: 'تضم علوم الأغذية، البيوت المحمية، علوم المحيطات والأسماك، ومختبرات التربة والمياه ومزرعة الجامعة البحثية.',
    workingHours: '07:30 ص - 04:00 م',
    tags: ['زراعة', 'بحرية', 'أغذية', 'أسماك', 'بيوت محمية', 'cams'],
    badge: 'العلوم التطبيقية'
  },

  // =================== القاعات والمدرجات (HALLS & AUDITORIUMS - WITH INDOOR NAVIGATION) ===================
  {
    id: 'hall_alfaham',
    name: 'مدرج الفهم (القاعة الكبرى)',
    nameEn: 'Al-Faham Amphitheatre & Grand Hall',
    code: 'FAHAM-1',
    category: 'hall',
    coordinates: [23.5912, 58.1739],
    floor: 'الطابق الأرضي والميزانين',
    description: 'أكبر مدرج وقاعة احتفالات ومؤتمرات في جامعة السلطان قابوس، تُعقد فيها الفعاليات الرسمية، الامتحانات العامة، والندوات الدولية.',
    tags: ['الفهم', 'مدرج الفهم', 'القاعة الكبرى', 'مسرح', 'امتحانات', 'مؤتمرات', 'حفلات'],
    isPopular: true,
    badge: 'مدرج رئيسي',
    indoorDirections: {
      entrance: 'البوابة الرئيسية للمركز الثقافي المقابلة لبرج الساعة',
      floorLevel: 'الطابق الأرضي (المدخل الرئيسي للقاعة)',
      steps: [
        'ادخل من البوابة الزجاجية الكبيرة للمركز الثقافي.',
        'سر في البهو الرخامي الرئيسي مباشرة إلى الأمام لمسافة 25 متراً.',
        'ستجد الأبواب الخشبية المزخرفة الكبيرة لمدرج الفهم أمامك مباشرة.',
        'للوصول إلى مدرج الشرفة العلوية (الميزانين): اصعد الدرج الحلزوني الواسع يميناً أو استخدم المصعد رقم 2 إلى الطابق الأول.'
      ],
      landmarks: ['أمام بهو المركز الثقافي', 'بجوار مكتب الاستقبال والاستعلامات', 'مقابل معرض تاريخ الجامعة'],
      hasElevator: true,
      wheelchairAccessible: true,
      nearestRestroom: 'على يمين المدخل الرئيسي للمدرج (مرفق مجهز لذوي الإعاقة)',
      nearestPrayerRoom: 'مصلى المركز الثقافي في الممر الأيمن'
    }
  },
  {
    id: 'hall_eng_101',
    name: 'قاعة 101 - كلية الهندسة',
    nameEn: 'Hall 101 - College of Engineering',
    code: 'ENG-101',
    category: 'hall',
    parentBuildingId: 'col_engineering',
    parentBuildingName: 'كلية الهندسة',
    coordinates: [23.5932, 58.1703],
    floor: 'الطابق الأرضي',
    wing: 'الجناح الغربي (قسم الهندسة الكهربائية والحاسب)',
    description: 'قاعة محاضرات تتسع لنحو 90 طالباً، مجهزة بنظام العرض التفاعلي الذكي ومنصات الشحن الكهربائية.',
    tags: ['101', 'هندسة 101', 'قاعة 101', 'كهرباء', 'محاضرات'],
    isPopular: true,
    badge: 'قاعة محاضرات',
    indoorDirections: {
      entrance: 'مدخل كلية الهندسة الغربي (المقابل لمواقف سيارات الطلاب B4)',
      floorLevel: 'الطابق الأرضي (Ground Floor)',
      steps: [
        'ادخل من البوابة الغربية لكلية الهندسة.',
        'سر في الممر الرئيسي لنحو 15 متراً.',
        'انعطف يساراً عند لوحة إعلانات قسم الهندسة الكهربائية.',
        'قاعة 101 هي ثاني باب على يدك اليمنى، مكتوب عليها بوضوح (Room ENG 101).'
      ],
      landmarks: ['بجوار مكتب رئيس قسم الهندسة الكهربائية', 'مقابل صراف بنك مسقط الداخلي', 'قبل استراحة الطلبة ببابين'],
      hasElevator: true,
      wheelchairAccessible: true,
      nearestRestroom: 'في نهاية الممر على اليسار بجوار المصعد الغربي',
      nearestPrayerRoom: 'مصلى الطلاب بالطابق الأرضي (ممر C)'
    }
  },
  {
    id: 'hall_eng_215',
    name: 'قاعة 215 ومختبر التصميم - كلية الهندسة',
    nameEn: 'Hall 215 & Design Lab - Engineering',
    code: 'ENG-215',
    category: 'hall',
    parentBuildingId: 'col_engineering',
    parentBuildingName: 'كلية الهندسة',
    coordinates: [23.5933, 58.1708],
    floor: 'الطابق الثاني',
    wing: 'الجناح الشرقي (قسم الهندسة الميكانيكية والصناعية)',
    description: 'قاعة تفاعلية ومختبر حواسيب هندسية برامج CAD/CAM ومشاريع التخرج.',
    tags: ['215', 'قاعة 215', 'ميكانيكا', 'تصميم', 'تخرج'],
    badge: 'مختبر وقاعة',
    indoorDirections: {
      entrance: 'المدخل الرئيسي لكلية الهندسة (تحت المظلة الهندسية الكبرى)',
      floorLevel: 'الطابق الثاني (2nd Floor)',
      steps: [
        'ادخل من الباب الرئيسي واصعد الدرج الواسع إلى الطابق الأول ثم الثاني (أو استقل المصعد المركزي رقم 1 إلى الطابق الثاني).',
        'عند الخروج من المصعد أو الدرج في الطابق الثاني، اتجه يميناً باتجاه الجناح الشرقي (قسم الميكانيكا).',
        'تابع السير في الممر المستقيم حتى المنتصف.',
        'ستجد قاعة 215 على يسارك مع شاشة رقمية بجانب الباب تعرض جدول المحاضرات.'
      ],
      landmarks: ['بجانب مكتب منسق قسم الهندسة الميكانيكية', 'مقابل شاشات عرض مشاريع الطلاب السنوية'],
      hasElevator: true,
      wheelchairAccessible: true,
      nearestRestroom: 'بجوار مخرج الطوارئ والدرج الشرقي',
      nearestPrayerRoom: 'مصلى الطابق الثاني (جناح الميكانيكا)'
    }
  },
  {
    id: 'hall_sci_farahidi',
    name: 'مدرج الفراهيدي - كلية العلوم',
    nameEn: 'Al-Farahidi Auditorium - Science',
    code: 'SCI-AUD-1',
    category: 'hall',
    parentBuildingId: 'col_science',
    parentBuildingName: 'كلية العلوم',
    coordinates: [23.5919, 58.1693],
    floor: 'الطابق الأول',
    wing: 'القلب المركزي للكلية',
    description: 'المدرج الرئيسي لكلية العلوم، يتسع لأكثر من 250 طالباً، تعقد فيه محاضرات الكيمياء العامة والفيزياء 1 و2 ومحاضرات علوم الحاسوب.',
    tags: ['فراهيدي', 'مدرج الفراهيدي', 'علوم', 'فيزياء', 'كيمياء', 'محاضرات عامة'],
    isPopular: true,
    badge: 'مدرج رئيسي',
    indoorDirections: {
      entrance: 'المدخل الجنوبي لكلية العلوم المقابل لساحة النوافير',
      floorLevel: 'الطابق الأول (1st Floor)',
      steps: [
        'ادخل من البوابة الجنوبية لكلية العلوم.',
        'ستجد الدرج الرئيسي الواسع أمامك مباشرة في البهو.',
        'اصعد الدرج إلى الطابق الأول (أو استخدم المصعد الموجود على يمين البهو إلى الطابق 1).',
        'عند وصولك الطابق الأول، ستجد مدخل مدرج الفراهيدي بأبوابه المزدوجة العريضة أمامك مباشرة مع لوحة نحاسية باسم المدرج.'
      ],
      landmarks: ['فوق بهو كلية العلوم مباشرة', 'مقابل مكتب العميد المساعد للدراسات الجامعية', 'بجانب بنك الإعلانات الأكاديمية'],
      hasElevator: true,
      wheelchairAccessible: true,
      nearestRestroom: 'على بعد 10 أمتار يمين مدخل المدرج',
      nearestPrayerRoom: 'مصلى كلية العلوم بالطابق الأرضي (جناح الرياضيات)'
    }
  },
  {
    id: 'hall_sci_lab12',
    name: 'مختبرات الحاسب الآلي 1 & 2 - كلية العلوم',
    nameEn: 'Computer Labs 1 & 2 - Dept of Computer Science',
    code: 'SCI-CS-LAB1',
    category: 'hall',
    parentBuildingId: 'col_science',
    parentBuildingName: 'كلية العلوم',
    coordinates: [23.5916, 58.1697],
    floor: 'الطابق الأرضي',
    wing: 'جناح قسم علوم الحاسب الآلي',
    description: 'مختبرات الحواسب الحديثة المخصصة لمساقات البرمجة، هياكل البيانات، والذكاء الاصطناعي وشبكات الحاسب.',
    tags: ['مختبر', 'حاسب', 'كمبيوتر', 'برمجة', 'lab', 'cs'],
    badge: 'مختبر برمجة',
    indoorDirections: {
      entrance: 'المدخل الشرقي لكلية العلوم (المواجه لكلية التجارة CEPS)',
      floorLevel: 'الطابق الأرضي (Ground Floor)',
      steps: [
        'ادخل من البوابة الشرقية لكلية العلوم.',
        'اتجه مباشرة إلى الممر الأيمن الخاص بقسم علوم الحاسب.',
        'سر لنحو 20 متراً، ستجد مدخل المختبرات Lab 1 و Lab 2 على يدك اليسرى.',
        'الدخول بالبطاقة الجامعية للطلبة المسجلين في المساقات.'
      ],
      landmarks: ['أمام مكتب الفنيين ومساعدي التدريس', 'بجوار طابعات الطلاب المركزية'],
      hasElevator: true,
      wheelchairAccessible: true,
      nearestRestroom: 'بجوار مخرج الطوارئ الأيمن',
      nearestPrayerRoom: 'مصلى الطابق الأرضي'
    }
  },
  {
    id: 'hall_ceps_0023',
    name: 'قاعة 0023 - كلية الاقتصاد والعلوم السياسية',
    nameEn: 'Hall 0023 - CEPS',
    code: 'CEPS-0023',
    category: 'hall',
    parentBuildingId: 'col_ceps',
    parentBuildingName: 'كلية الاقتصاد والعلوم السياسية',
    coordinates: [23.5899, 58.1699],
    floor: 'الطابق الأرضي (مستوى البهو السفلي)',
    wing: 'الجناح الغربي',
    description: 'إحدى أكبر قاعات محاضرات كلية الاقتصاد، مجهزة بشاشات عرض متعددة ومقاعد مدرجة ومكيفات متطورة.',
    tags: ['0023', 'ceps 0023', 'تجارة', 'اقتصاد', 'محاسبة', 'إدارة'],
    isPopular: true,
    badge: 'قاعة مدرجة',
    indoorDirections: {
      entrance: 'المدخل الرئيسي لكلية CEPS (المواجه لمبنى برج الساعة والمكتبة)',
      floorLevel: 'الطابق الأرضي (Ground Floor)',
      steps: [
        'ادخل من البوابة الدوارة لبهو كلية الاقتصاد والعلوم السياسية.',
        'اتجه يميناً بعد مكتب الاستقبال والأمن.',
        'سر في الرواق الرئيسي باتجاه الجناح الغربي حتى ترى مقهى الكلية على يسارك.',
        'تابع السير 10 أمتار إضافية، ستجد قاعة 0023 على اليمين ببابين رماديين عريضين ولوحة مضيئة بالأعلى.'
      ],
      landmarks: ['بعد مقهى CEPS بمسافة 10 أمتار', 'مقابل مكاتب قسم الإدارة ونظم المعلومات', 'بجوار مخرج الحديقة الداخلية للكلية'],
      hasElevator: true,
      wheelchairAccessible: true,
      nearestRestroom: 'مباشرة في الممر المتفرع خلف القاعة',
      nearestPrayerRoom: 'مصلى الكلية في نهاية الجناح الغربي'
    }
  },
  {
    id: 'hall_ceps_trading',
    name: 'قاعة المحاكاة والتداول المالي',
    nameEn: 'Financial Trading Simulation Room',
    code: 'CEPS-TRADE',
    category: 'hall',
    parentBuildingId: 'col_ceps',
    parentBuildingName: 'كلية الاقتصاد والعلوم السياسية',
    coordinates: [23.5897, 58.1696],
    floor: 'الطابق الأول',
    wing: 'قسم المالية والمصارف',
    description: 'قاعة مجهزة بشاشات تداول أسواق المال العالمية مثل Bloomberg ومحاكاة بورصة مسقط لطلبة التمويل والمصارف.',
    tags: ['تداول', 'بورصة', 'بلومبيرغ', 'bloomberg', 'مالية', 'أسهم'],
    badge: 'قاعة تخصصية',
    indoorDirections: {
      entrance: 'المدخل الرئيسي للكلية',
      floorLevel: 'الطابق الأول (1st Floor)',
      steps: [
        'من بهو الاستقبال الرئيسي، اصعد عبر المصعد المركزي أو السلم الزجاجي إلى الطابق الأول.',
        'اتجه إلى اليسار باتجاه قسم المالية والاقتصاد.',
        'سر في الممر حتى تجد الغرفة الزجاجية ذات شريط أسعار الأسهم المضيء المتحرك (Ticker).',
        'هذه هي قاعة المحاكاة والتداول المالي.'
      ],
      landmarks: ['الشاشات الرقمية لأسعار العملات والأسهم واضحة من الخارج', 'مقابل مكتب رئيس قسم المالية'],
      hasElevator: true,
      wheelchairAccessible: true
    }
  },
  {
    id: 'hall_arts_khaldun',
    name: 'قاعة ابن خلدون - كلية الآداب',
    nameEn: 'Ibn Khaldun Hall - College of Arts',
    code: 'ARTS-KHALDUN',
    category: 'hall',
    parentBuildingId: 'col_arts',
    parentBuildingName: 'كلية الآداب والعلوم الاجتماعية',
    coordinates: [23.5879, 58.1708],
    floor: 'الطابق الأرضي',
    wing: 'القلب المركزي للكلية',
    description: 'قاعة متعددة الأغراض للمؤتمرات الأدبية والندوات الفكرية وعروض مسرح الكلية واللقاءات الطلابية.',
    tags: ['ابن خلدون', 'مسرح الآداب', 'ندوات', 'محاضرات'],
    badge: 'قاعة احتفالات',
    indoorDirections: {
      entrance: 'بوابة كلية الآداب الرئيسية المطلة على الممر المشجر',
      floorLevel: 'الطابق الأرضي',
      steps: [
        'ادخل من البوابة الرئيسية لكلية الآداب.',
        'اعبر البهو الدائري المميز بتمثال الكتاب والقصيدة.',
        'ستجد مدخل قاعة ابن خلدون بأبوابه الخشبية الأندلسية أمامك مباشرة.'
      ],
      landmarks: ['في قلب البهو الدائري للكلية', 'بجوار قاعة المعارض التشكيلية لكلية الآداب'],
      hasElevator: true,
      wheelchairAccessible: true
    }
  },

  // =================== المكتبات والمراكز (LIBRARIES & CENTERS) ===================
  {
    id: 'lib_main',
    name: 'المكتبة الرئيسية (مكتبة الجامعة)',
    nameEn: 'Main University Library',
    code: 'LIB-MAIN',
    category: 'library',
    coordinates: [23.5902, 58.1732],
    floor: '4 طوابق (قبو، أرضي، أول، ثاني)',
    description: 'المكتبة المركزية الضخمة لجامعة السلطان قابوس، توفر آلاف المراجع والمخطوطات العمانية، غرف المذاكرة الفردية والجماعية، وقاعات الحواسيب والإنترنت السريع.',
    workingHours: '08:00 ص - 10:00 م (الأحد - الخميس) | 02:00 م - 09:00 م (السبت)',
    tags: ['مكتبة', 'كتب', 'مذاكرة', 'مراجع', 'دراسة', 'إنترنت', 'library', 'مخطوطات'],
    isPopular: true,
    badge: 'صرح معرفي رئيسي',
    phone: '2414 1700',
    indoorDirections: {
      entrance: 'المدخل الجنوبي المواجه لبرج الساعة وبركة النوافير',
      floorLevel: 'طوابق متعددة',
      steps: [
        'اعبر بوابات الفحص الإلكترونية في المدخل الرئيسي.',
        'الطابق الأرضي: قسم الإعارة والاسترجاع، مكتب الاستعلامات، أجهزة البحث الآلي، وأكشاك الطباعة الذاتية.',
        'الطابق الأول: المراجع العلمية، الدوريات، وقاعات الدراسة الصامتة للطلاب (القسم الأيمن).',
        'الطابق الثاني: غرف المذاكرة الهادئة، أجهزة الحاسب، وقسم الرسائل الجامعية والمخطوطات.',
        'المصاعد متوفرة فور الدخول على اليد اليمنى واليسرى.'
      ],
      landmarks: ['أمام ساحة برج الساعة', 'بجوار مقهى المكتبة واستراحة الطلاب'],
      hasElevator: true,
      wheelchairAccessible: true,
      nearestRestroom: 'متوفرة في كل طابق بالقرب من مجمع المصاعد',
      nearestPrayerRoom: 'مصليات مجهزة في الطابق الأرضي والطابق الأول'
    }
  },
  {
    id: 'center_admissions',
    name: 'عمادة القبول والتسجيل وشؤون الطلاب',
    nameEn: 'Deanship of Admissions, Registration & Student Affairs',
    code: 'ADM-REG',
    category: 'service',
    coordinates: [23.5908, 58.1718],
    floor: 'الطابق الأرضي والأول',
    description: 'إنجاز معاملات الجداول الدراسية، البطاقات الجامعية، الوثائق الرسمية، السكن الداخلي، والأنشطة الطلابية والإرشاد.',
    workingHours: '08:00 ص - 02:00 م',
    tags: ['تسجيل', 'قبول', 'جداول', 'بطاقة جامعية', 'شؤون الطلاب', 'شهادات'],
    isPopular: true,
    badge: 'خدمات طلابية',
    phone: '2414 1800',
    indoorDirections: {
      entrance: 'مبنى إدارة الجامعة تحت برج الساعة الشهير',
      floorLevel: 'الطابق الأرضي',
      steps: [
        'ادخل من البوابة الرئيسية لمبنى الإدارة (أسفل برج الساعة).',
        'صالة المراجعين والخدمات الطلابية تقع على يمينك فور الدخول.',
        'اسحب رقم الانتظار من جهاز الخدمة الذاتية حسب نوع معاملتك (تسجيل، وثائق، إعفاءات).'
      ],
      landmarks: ['أسفل برج الساعة مباشرة', 'مقابل مواقف سيارات الإدارة'],
      hasElevator: true,
      wheelchairAccessible: true
    }
  },
  {
    id: 'center_cultural',
    name: 'المركز الثقافي لجامعة السلطان قابوس',
    nameEn: 'SQU Cultural Centre',
    code: 'CULT-CTR',
    category: 'service',
    coordinates: [23.5910, 58.1743],
    description: 'يضم القاعة الكبرى، معرض الفنون التشكيلية، مركز المخطوطات والوثائق العمانية، واستضافة المؤتمرات المحلية والدولية.',
    workingHours: '08:00 ص - 08:00 م',
    tags: ['ثقافي', 'مركز', 'معرض', 'مؤتمرات', 'تاريخ', 'مسرح'],
    badge: 'معلم ثقافي'
  },
  {
    id: 'center_cis',
    name: 'مركز نظم المعلومات (CIS) - الدعم الفني',
    nameEn: 'Centre for Information Systems (CIS)',
    code: 'CIS',
    category: 'service',
    coordinates: [23.5925, 58.1712],
    floor: 'الطابق الأرضي',
    description: 'مكتب الدعم الفني لحسابات الطلبة (SQU Portal)، شبكة الواي فاي (Eduroam & SQU-WiFi)، والبريد الجامعي والأنظمة الإلكترونية.',
    workingHours: '07:30 ص - 03:00 م',
    tags: ['دعم فني', 'واي فاي', 'wifi', 'باسورد', 'حساب جامعي', 'cis', 'بريد'],
    badge: 'دعم تقني',
    phone: '2414 2222',
    indoorDirections: {
      entrance: 'المدخل الشرقي لمبنى نظم المعلومات المقابل لكلية العلوم',
      floorLevel: 'الطابق الأرضي - مكتب مساعدة المستفيدين (Helpdesk)',
      steps: [
        'ادخل من البوابة الزجاجية.',
        'مكتب خدمة المستفيدين أمامك مباشرة (IT Service Desk).',
        'تستطيع تهيئة شبكة الواي فاي على هاتفك أو حاسبك واستعادة كلمات المرور فوراً.'
      ],
      landmarks: ['بجانب مواقف حافلات الكليات', 'قريب من كلية العلوم'],
      hasElevator: true,
      wheelchairAccessible: true
    }
  },

  // =================== المستشفى والمراكز الصحية (SQUH & HEALTH) ===================
  {
    id: 'hosp_squh_emergency',
    name: 'طوارئ مستشفى جامعة السلطان قابوس (SQUH ER)',
    nameEn: 'SQU Hospital - Emergency Department',
    code: 'SQUH-ER',
    category: 'hospital',
    coordinates: [23.5962, 58.1765],
    floor: 'الطابق الأرضي',
    description: 'قسم الطوارئ والحوادث في مستشفى الجامعة متاح على مدار الساعة 24/7 لخدمة الطلبة والموظفين والمجتمع.',
    workingHours: 'على مدار 24 ساعة (طوال أيام الأسبوع)',
    tags: ['طوارئ', 'إسعاف', 'مستشفى', 'عيادة', 'طبيب', 'صحة', 'squh', 'emergency'],
    isPopular: true,
    badge: 'طوارئ 24/7',
    phone: '2414 4444',
    indoorDirections: {
      entrance: 'بوابة الطوارئ الخاصة (المواجهة للبوابة الشمالية رقم 2 للمستشفى)',
      floorLevel: 'الطابق الأرضي',
      steps: [
        'الدخول المباشر من مدخل سيارات الإسعاف ومواقف الطوارئ السريعة.',
        'مكتب فرز الحالات والتسجيل الطبي في الواجهة مباشرة.'
      ],
      landmarks: ['شعار الهلال الأحمر واللوحة الحمراء المضيئة (الطوارئ EMERGENCY)'],
      hasElevator: true,
      wheelchairAccessible: true
    }
  },
  {
    id: 'hosp_outpatient',
    name: 'العيادات الخارجية ومختبرات فحص الدم - SQUH',
    nameEn: 'Outpatient Clinics & Phlebotomy Lab',
    code: 'SQUH-OPD',
    category: 'hospital',
    coordinates: [23.5958, 58.1758],
    floor: 'الطابق الأرضي والأول',
    description: 'العيادات التخصصية الشاملة، الصيدلية المركزية للمستشفى، ومختبرات الفحوصات والتحاليل الطبية وبنك الدم.',
    workingHours: '07:30 ص - 04:00 م',
    tags: ['عيادات', 'صيدلية', 'مختبر دم', 'فحص', 'تحاليل', 'طبيب'],
    badge: 'رعاية صحية',
    phone: '2414 7777'
  },
  {
    id: 'clinic_student',
    name: 'العيادة الطبية الطلابية (مركز الرعاية الأولية للطلبة)',
    nameEn: 'Student Health Clinic',
    code: 'STU-CLINIC',
    category: 'hospital',
    coordinates: [23.5938, 58.1740],
    floor: 'الطابق الأرضي',
    description: 'عيادة مخصصة للرعاية الصحية الأولية لطلاب وطالبات الجامعة، وصرف الأدوية البسيطة والتقارير الطبية للأعذار.',
    workingHours: '08:00 ص - 08:00 م',
    tags: ['عيادة طلابية', 'عذر طبي', 'دواء', 'صيدلية طلاب', 'مرض'],
    isPopular: true,
    badge: 'خدمة الطلبة'
  },

  // =================== الكوفيهات والمقاهي المعتمدة بالحرم (COFFEE SHOPS & CAFES) ===================
  {
    id: 'cafe_steps_lib',
    name: 'ستبس كافيه (Steps Cafe) - فرع المكتبة الرئيسية',
    nameEn: 'Steps Coffee - Main Library Branch',
    code: 'CAFE-STEPS-LIB',
    category: 'dining',
    coordinates: [23.5902, 58.1732],
    floor: 'الطابق الأرضي - بهو المكتبة الرئيسية',
    description: 'مقهى ستبس الشهير، يقع داخل بهو المكتبة الرئيسية بالجامعة، المفضل للطلبة للمذاكرة والقهوة المتخصصة والمخبوزات الطازجة.',
    workingHours: '07:30 ص - 09:30 م',
    tags: ['ستبس', 'steps', 'steps cafe', 'كوفي', 'قهوة', 'مكتبة', 'مذاكرة', 'مقهى'],
    isPopular: true,
    badge: 'ستبس كافيه ☕',
    indoorDirections: {
      entrance: 'المدخل الجنوبي للمكتبة الرئيسية المقابل لبرج الساعة',
      floorLevel: 'الطابق الأرضي (بهو المكتبة)',
      steps: [
        'ادخل من البوابة الرئيسية للمكتبة المركزية.',
        'اعبر بوابات الفحص الإلكترونية.',
        'ستجد كشك وجلسات مقهى Steps في بهو الطابق الأرضي.'
      ],
      landmarks: ['في بهو المكتبة الرئيسية', 'بجوار صالة المطالعة السريعة'],
      hasElevator: true,
      wheelchairAccessible: true
    }
  },
  {
    id: 'cafe_steps_admissions',
    name: 'ستبس كافيه (Steps Cafe) - فرع عمادة القبول والتسجيل',
    nameEn: 'Steps Coffee - Deanship of Admissions Branch',
    code: 'CAFE-STEPS-ADM',
    category: 'dining',
    coordinates: [23.5907, 58.1716],
    floor: 'الساحة الخارجية - أمام عمادة القبول والتسجيل',
    description: 'فرع مقهى ستبس، يقع في الساحة المفتوحة مباشرة أمام مبنى عمادة القبول والتسجيل وإدارة الجامعة أسفل برج الساعة الشهير.',
    workingHours: '07:30 ص - 05:00 م',
    tags: ['ستبس', 'steps', 'قبول وتسجيل', 'عمادة', 'برج الساعة', 'كوفي', 'قهوة'],
    isPopular: true,
    badge: 'ستبس كافيه ☕',
    indoorDirections: {
      entrance: 'الساحة المفتوحة أمام مبنى إدارة الجامعة وعمادة القبول والتسجيل',
      floorLevel: 'الساحة الخارجية',
      steps: [
        'توجه نحو مبنى إدارة الجامعة تحت برج الساعة.',
        'ستجد كشك وجلسات ستبس كافيه في الساحة الأمامية مباشرة أمام مدخل صالة القبول والتسجيل.'
      ],
      landmarks: ['أمام مدخل عمادة القبول والتسجيل', 'تحت برج الساعة الشهير'],
      hasElevator: false,
      wheelchairAccessible: true
    }
  },
  {
    id: 'cafe_ratio_med',
    name: 'ريشيو كافيه (Ratio Specialty Coffee) - كلية الطب',
    nameEn: 'Ratio Specialty Coffee - College of Medicine',
    code: 'CAFE-RATIO',
    category: 'dining',
    coordinates: [23.5950, 58.1755],
    floor: 'بهو ومحيط مبنى كلية الطب والعلوم الصحية',
    description: 'مقهى ريشيو للقهوة المختصة (Ratio SQU)، يقع عند كلية الطب والعلوم الصحية، ويقدم أفخر أنواع القهوة المختصة والماتشا والمشروبات المنعشة والمخبوزات لطلبة وأطباء الطب والمستشفى الجامعي.',
    workingHours: '07:30 ص - 09:00 م',
    tags: ['ريشيو', 'ratio', 'ratio squ', 'قهوة مختصة', 'كلية الطب', 'ماتشا', 'مستشفى'],
    isPopular: true,
    badge: 'ريشيو كافيه ☕',
    indoorDirections: {
      entrance: 'مدخل بهو كلية الطب المواجه لشارع المستشفى الجامعي',
      floorLevel: 'بهو كلية الطب والعلوم الصحية',
      steps: [
        'توجه إلى مجمع كلية الطب والعلوم الصحية بجوار المستشفى الجامعي.',
        'ستجد كوفي ريشيو (Ratio) بجلساته المميزة عند بهو الكلية والممر الحيوي الرابط.'
      ],
      landmarks: ['عند كلية الطب والعلوم الصحية', 'قريب من بوابة المستشفى الجامعي الداخلية'],
      hasElevator: true,
      wheelchairAccessible: true
    }
  },
  {
    id: 'cafe_dune_cultural',
    name: 'ديون كافيه (Dune Cafe) - المركز الثقافي للجامعة',
    nameEn: 'Dune Cafe - SQU Cultural Centre',
    code: 'CAFE-DUNE',
    category: 'dining',
    coordinates: [23.5911, 58.1743],
    floor: 'الطابق الأرضي - المركز الثقافي',
    description: 'مقهى ديون الراقي، يقع في المركز الثقافي لجامعة السلطان قابوس، ويوفر بيئة هادئة ومميزة لتناول القهوة المتخصصة والحلويات والعصائر.',
    workingHours: '08:00 ص - 09:00 م',
    tags: ['ديون', 'dune', 'dune cafe', 'المركز الثقافي', 'ثقافي', 'قهوة', 'كافيه'],
    isPopular: true,
    badge: 'ديون كافيه ☕',
    indoorDirections: {
      entrance: 'البوابة الرئيسية للمركز الثقافي لجامعة السلطان قابوس',
      floorLevel: 'الطابق الأرضي',
      steps: [
        'ادخل من المدخل الرئيسي لمبنى المركز الثقافي.',
        'اعبر بهو الاستقبال والمعارض.',
        'ستجد مقهى Dune بجلساته الأنيقة في قلب المركز الثقافي.'
      ],
      landmarks: ['داخل المركز الثقافي للجامعة', 'بجوار قاعة المعارض والمسرح الكبير'],
      hasElevator: true,
      wheelchairAccessible: true
    }
  },
  {
    id: 'cafe_shahi_al_fareej',
    name: 'شاي الفريج - المركز الثقافي للجامعة',
    nameEn: 'Chai Al Fareej - SQU Cultural Centre',
    code: 'CAFE-FAREEJ',
    category: 'dining',
    coordinates: [23.5912, 58.1744],
    floor: 'الطابق الأرضي - المركز الثقافي',
    description: 'محل شاي الفريج الأصيل، يقع في المركز الثقافي للجامعة عند نفس موقع ديون كافيه (Dune)، ويقدم الشاي الكرك، الشاي الزعفران، والمأكولات الخفيفة والمخبوزات الشعبية.',
    workingHours: '08:00 ص - 09:00 م',
    tags: ['شاي الفريج', 'الفريج', 'كرك', 'شاي', 'المركز الثقافي', 'dune', 'شاي كرك'],
    isPopular: true,
    badge: 'شاي الفريج ☕',
    indoorDirections: {
      entrance: 'البوابة الرئيسية للمركز الثقافي للجامعة',
      floorLevel: 'الطابق الأرضي',
      steps: [
        'ادخل من البوابة الرئيسية لمبنى المركز الثقافي.',
        'توجه إلى منطقة المقاهي عند موقع مقهى ديون (Dune).',
        'ستجد منفذ شاي الفريج مباشرة بجوار موقع ديون.'
      ],
      landmarks: ['في المركز الثقافي بجوار ديون كافيه مباشرة'],
      hasElevator: true,
      wheelchairAccessible: true
    }
  },
  {
    id: 'cafe_karak_roti_cps',
    name: 'كرك وروتي - خلف مبنى مركز الدراسات التحضيرية (CPS)',
    nameEn: 'Karak & Roti - Behind Centre for Preparatory Studies (CPS)',
    code: 'CAFE-KARAK-ROTI',
    category: 'dining',
    coordinates: [23.5908, 58.1712],
    floor: 'الجهة الخلفية - مبنى الدراسات التحضيرية CPS',
    description: 'مقهى كرك وروتي المحبوب للطلبة، يقع خلف مبنى مركز الدراسات التحضيرية (CPS - Centre for Preparatory Studies)، ويشتهر بشاي الكرك الطازج، روتي الجبن والبيض، والشباتي الساخن والمأكولات الخفيفة.',
    workingHours: '07:00 ص - 08:00 م',
    tags: ['كرك وروتي', 'كرك', 'روتي', 'الدراسات التحضيرية', 'cps', 'شباتي', 'فطور', 'كافيه', 'تحضيرية'],
    isPopular: true,
    badge: 'كرك وروتي 🫓',
    indoorDirections: {
      entrance: 'الممر والمواقف الخلفية لمبنى مركز الدراسات التحضيرية (CPS)',
      floorLevel: 'الجهة الخلفية لمبنى الدراسات التحضيرية',
      steps: [
        'اتجه إلى مبنى مركز الدراسات التحضيرية (CPS).',
        'التف خلف المبنى جهة الممر والمواقف الخلفية لمركز الدراسات التحضيرية.',
        'ستجد كوفي كرك وروتي مع جلسات الطلاب الخارجية المظللة.'
      ],
      landmarks: ['خلف مبنى مركز الدراسات التحضيرية (CPS) مباشرة', 'قريب من ممر الإدارة'],
      hasElevator: false,
      wheelchairAccessible: true
    }
  },
  {
    id: 'cafe_meeras_sci',
    name: 'مقهى ميراس (Meeras Cafe) - كلية العلوم',
    nameEn: 'Meeras Cafe - College of Science',
    code: 'CAFE-MEERAS',
    category: 'dining',
    coordinates: [23.5922, 58.1706],
    floor: 'الطابق الأرضي - بهو كلية العلوم',
    description: 'مقهى ميراس الشهير في جامعة السلطان قابوس، يقدم المشروبات الساخنة والباردة، الشاي والكرك، والسندويتشات الطازجة للطلبة وأعضاء التدريس.',
    workingHours: '07:30 ص - 05:00 م',
    tags: ['ميراس', 'meeras', 'كلية العلوم', 'كافيه', 'سندويتشات', 'شاي'],
    isPopular: true,
    badge: 'مقهى ميراس ☕',
    indoorDirections: {
      entrance: 'المدخل الجنوبي لكلية العلوم',
      floorLevel: 'الطابق الأرضي',
      steps: [
        'ادخل من البوابة الجنوبية لكلية العلوم.',
        'ستجد مقهى ميراس في منطقة الاستراحة الطلابية بالطابق الأرضي.'
      ],
      landmarks: ['في بهو كلية العلوم بالطابق الأرضي'],
      hasElevator: false,
      wheelchairAccessible: true
    }
  },
  {
    id: 'cafe_caribou_hosp',
    name: 'كاريبو كوفي (Caribou Coffee) - مستشفى الجامعة SQUH',
    nameEn: 'Caribou Coffee - SQU Hospital Lobby',
    code: 'CAFE-CARIBOU-SQUH',
    category: 'dining',
    coordinates: [23.5958, 58.1762],
    floor: 'الطابق الأرضي - بهو المستشفى الرئيسي',
    description: 'مقهى كاريبو كوفي العالمي داخل مستشفى جامعة السلطان قابوس، يقدم تشكيلة القهوة الأمريكية، اللاتيه، الموكا، والحلويات لزوار المستشفى والطلبة والأطباء.',
    workingHours: '07:00 ص - 10:00 م',
    tags: ['كاريبو', 'caribou', 'مستشفى الجامعة', 'squh', 'قهوة', 'كافيه'],
    isPopular: true,
    badge: 'كاريبو كوفي ☕',
    indoorDirections: {
      entrance: 'المدخل الرئيسي لمستشفى جامعة السلطان قابوس (بوابة 2)',
      floorLevel: 'الطابق الأرضي - بهو الاستقبال',
      steps: [
        'ادخل من البوابة الرئيسية لمستشفى جامعة السلطان قابوس.',
        'ستجد فرع كاريبو كوفي أمامك في بهو المستشفى الرئيسي بجوار الاستقبال.'
      ],
      landmarks: ['في بهو مستشفى الجامعة SQUH الرئيسي'],
      hasElevator: true,
      wheelchairAccessible: true
    }
  },
  {
    id: 'cafe_karak_saffron_mall',
    name: 'شاي كرك وزعفران - المركز التجاري بالحرم',
    nameEn: 'Karak & Saffron Cafe - SQU Commercial Centre',
    code: 'CAFE-SAFFRON',
    category: 'dining',
    coordinates: [23.5892, 58.1742],
    floor: 'الطابق الأرضي - المركز التجاري والخدمي',
    description: 'مقهى شاي كرك وزعفران في المركز التجاري للجامعة، يقدم الشاي الكرك بالزعفران والهيل، الشباتي الطازج، والوجبات الخفيفة للطلبة.',
    workingHours: '07:00 ص - 09:30 م',
    tags: ['كرك وزعفران', 'كرك', 'زعفران', 'المركز التجاري', 'سكنات', 'شباتي'],
    isPopular: true,
    badge: 'كرك وزعفران 🫖',
    indoorDirections: {
      entrance: 'بوابة المركز التجاري والخدمي بجوار سكنات الطلاب',
      floorLevel: 'الطابق الأرضي',
      steps: [
        'ادخل من المدخل الرئيسي للمركز التجاري للجامعة.',
        'ستجد المقهى في ممر المطاعم بالطابق الأرضي.'
      ],
      landmarks: ['في المركز التجاري للجامعة بجوار السكنات'],
      hasElevator: false,
      wheelchairAccessible: true
    }
  },

  // =================== الرياضة والمساجد والمرافق (SPORTS, MOSQUE, FACILITIES) ===================
  {
    id: 'mosque_main',
    name: 'مسجد جامعة السلطان قابوس الكبير',
    nameEn: 'SQU Grand University Mosque',
    code: 'MOSQUE',
    category: 'service',
    coordinates: [23.5915, 58.1755],
    description: 'المسجد الرئيسي في حرم الجامعة، يستوعب آلاف المصلين، وتُقام فيه صلاة الجمعة والمحاضرات الدينية والندوات القرآنية.',
    workingHours: 'مفتوح لأداء الصلوات الخمس وصلاة الجمعة',
    tags: ['مسجد', 'صلاة', 'جمعة', 'مصلى', 'جامع', 'وضوء'],
    isPopular: true,
    badge: 'مسجد الحرم الجامعي',
    indoorDirections: {
      entrance: 'البوابة الرخامية الكبيرة للصحن الخارجي للمسجد',
      floorLevel: 'الطابق الأرضي (مصلى الرجال) + الميزانين (مصلى النساء)',
      steps: [
        'أماكن الوضوء ودورات المياه متوفرة على جانبي الصحن الخارجي.',
        'الدخول لمصلى الرجال عبر البوابات الثلاث المركزية.',
        'مصلى النساء له مدخل منفصل ومصعد في الجناح الشمالي للمسجد.'
      ],
      landmarks: ['مئذنة المسجد الشاهقة التي ترى من معظم أرجاء الحرم الجامعي'],
      hasElevator: true,
      wheelchairAccessible: true
    }
  },
  {
    id: 'sports_complex',
    name: 'المجمع الرياضي للجامعة (Sports Complex)',
    nameEn: 'SQU Sports Complex & Stadium',
    code: 'SPORTS',
    category: 'sports',
    coordinates: [23.5880, 58.1770],
    description: 'يضم حوض سباحة أولمبي، استاد كرة القدم، ملاعب التنس وكرة السلة والطائرة، صالات اللياقة البدنية والحديد (Gym).',
    workingHours: '08:00 ص - 10:00 م (فترات مخصصة للطلاب وفترات للطالبات)',
    tags: ['رياضة', 'جيم', 'سباحة', 'مسبح', 'ملعب', 'حديد', 'كرة قدم', 'تنس', 'sports'],
    isPopular: true,
    badge: 'نشاط بدني ورياضي',
    indoorDirections: {
      entrance: 'بوابة الاستقبال الرئيسية للمجمع الرياضي',
      floorLevel: 'صالات متعددة وملاعب خارجية',
      steps: [
        'إبراز البطاقة الجامعية عند مكتب الاستقبال والتسجيل.',
        'صالة الألعاب الجماعية المغلقة ومسبح الجامعة على اليمين.',
        'صالات الحديد واللياقة البدنية في الطابق الأول.'
      ],
      landmarks: ['أبراج إضاءة الملعب الأولمبي'],
      hasElevator: true,
      wheelchairAccessible: true
    }
  },

  // =================== البوابات ومحطات الحافلات (GATES & BUS STOPS) ===================
  {
    id: 'gate_1_main',
    name: 'بوابة رقم 1 (البوابة الرئيسية - الخوض)',
    nameEn: 'Gate 1 (Main Entrance - Al Khoudh)',
    code: 'GATE-1',
    category: 'gate',
    coordinates: [23.5840, 58.1700],
    description: 'المدخل الرئيسي لجامعة السلطان قابوس من جهة دوار جامعة السلطان قابوس وسوق الخوض التجاري.',
    tags: ['بوابة 1', 'بوابة رئيسية', 'الخوض', 'دخول', 'gate 1'],
    badge: 'بوابة رئيسية'
  },
  {
    id: 'gate_2_hospital',
    name: 'بوابة رقم 2 (بوابة المستشفى الجامعي SQUH)',
    nameEn: 'Gate 2 (Hospital Entrance)',
    code: 'GATE-2',
    category: 'gate',
    coordinates: [23.5975, 58.1775],
    description: 'المدخل الشمالي المؤدي مباشرة إلى مستشفى جامعة السلطان قابوس وكلية التمريض وطوارئ المستشفى.',
    tags: ['بوابة 2', 'بوابة المستشفى', 'gate 2'],
    badge: 'بوابة المستشفى'
  },
  {
    id: 'bus_station_central',
    name: 'محطة الحافلات المركزية (مجمع الكليات)',
    nameEn: 'Colleges Central Bus Hub',
    code: 'BUS-HUB',
    category: 'bus',
    coordinates: [23.5910, 58.1710],
    description: 'نقطة الانطلاق الرئيسية لحافلات النقل الداخلي (المسار الأحمر والمسار الأخضر) طوال اليوم الدراسي.',
    tags: ['باص', 'حافلة', 'نقل داخلي', 'مواصلات', 'محطة', 'bus', 'أحمر', 'أخضر'],
    isPopular: true,
    badge: 'مواصلات الحرم'
  },
  {
    id: 'bus_stop_adab',
    name: 'محطة حافلات كلية الآداب',
    nameEn: 'College of Arts Bus Stop',
    code: 'BUS-ADAB',
    category: 'bus',
    coordinates: [23.5875, 58.1706],
    description: 'نقطة توقف رئيسية للمسار الأحمر والمسار الأخضر لحافلات الطالبات المتجهة للسكنات والكليات.',
    tags: ['محطة الآداب', 'باص', 'طالبات', 'مسار أحمر', 'مسار أخضر'],
    badge: 'المسار الأحمر والأخضر'
  },
  {
    id: 'bus_stop_hostel_123',
    name: 'محطة سكنات الطالبات (مجمع 1، 2، 3)',
    nameEn: 'Female Hostels 1, 2, 3 Bus Stop',
    code: 'BUS-HOSTEL-123',
    category: 'bus',
    coordinates: [23.5890, 58.1750],
    description: 'نقطة بداية ونهاية المسار الأحمر لحافلات الطالبات (F).',
    tags: ['مجمع 1', 'مجمع 2', 'مجمع 3', 'سكنات', 'مسار أحمر'],
    badge: 'المسار الأحمر'
  },
  {
    id: 'bus_stop_hostel_45',
    name: 'محطة سكنات الطالبات (مجمع 4، 5)',
    nameEn: 'Female Hostels 4, 5 Bus Stop',
    code: 'BUS-HOSTEL-45',
    category: 'bus',
    coordinates: [23.5895, 58.1760],
    description: 'نقطة بداية ونهاية المسار الأخضر لحافلات الطالبات (F).',
    tags: ['مجمع 4', 'مجمع 5', 'سكنات', 'مسار أخضر'],
    badge: 'المسار الأخضر'
  },
  {
    id: 'bus_stop_services_center',
    name: 'محطة حافلات مركز الخدمات للطلبة',
    nameEn: 'Student Services Center Bus Hub',
    code: 'BUS-SVC',
    category: 'bus',
    coordinates: [23.5905, 58.1700],
    description: 'نقطة انطلاق حافلات الطلبة الذكور (M) للمسار الأحمر والمسار الأخضر.',
    tags: ['مركز الخدمات', 'طلبة', 'باص', 'مسار أحمر', 'مسار أخضر'],
    badge: 'انطلاق حافلات الطلبة'
  },

  // =================== مرافق كلية التربية (استهلاكية، استراحة، مصلى) ===================
  {
    id: 'store_edu',
    name: 'استهلاكية كلية التربية',
    nameEn: 'College of Education Consumer Store',
    code: 'EDU-STORE',
    category: 'store',
    parentBuildingId: 'col_education',
    parentBuildingName: 'كلية التربية',
    hasMapPin: false, // وصف داخلي فقط بالكلية بدون دبوس خريطة
    floor: 'الطابق الأرضي',
    description: 'من الممر الخلفي لمسجد الجامعة، اتجه مباشرة عبر الممر الطويل؛ ستجد الاستهلاكية على يمينك مقابل عيادة الطلبة.',
    tags: ['استهلاكية', 'تربية', 'مقصف', 'عيادة الطلبة', 'مسجد الجامعة'],
    badge: 'استهلاكية الكلية 🛒',
    indoorDirections: {
      entrance: 'الممر الخلفي لمسجد الجامعة باتجاه الممر الطويل المؤدي إلى كلية التربية',
      floorLevel: 'الطابق الأرضي',
      steps: [
        'توجه إلى الممر الخلفي لمسجد الجامعة.',
        'امشِ إلى الأمام عبر الممر الطويل.',
        'ستجد الاستهلاكية على يمينك، مقابل عيادة الطلبة.'
      ],
      landmarks: ['الممر الخلفي لمسجد الجامعة', 'الممر الطويل', 'مقابل عيادة الطلبة وعلى اليمين'],
      hasElevator: false,
      wheelchairAccessible: true
    }
  },
  {
    id: 'lounge_edu',
    name: 'استراحة كلية التربية',
    nameEn: 'College of Education Student Lounge',
    code: 'EDU-LOUNGE',
    category: 'lounge',
    parentBuildingId: 'col_education',
    parentBuildingName: 'كلية التربية',
    hasMapPin: false,
    floor: 'الطابق العلوي',
    description: 'في الطابق العلوي فوق استهلاكية التربية الطلابية مباشرة.',
    tags: ['استراحة', 'تربية', 'مذاكرة', 'راحة', 'فوق الاستهلاكية'],
    badge: 'استراحة الكلية 🛋️',
    indoorDirections: {
      entrance: 'مدخل مبنى استهلاكية التربية المقابل لمسجد الجامعة',
      floorLevel: 'الطابق العلوي (فوق الاستهلاكية)',
      steps: [
        'ادخل من مبنى الاستهلاكية المقابل للمسجد والعيادة.',
        'اصعد الدرج إلى الطابق العلوي.',
        'ستكون الاستراحة أمامك مباشرة فوق الاستهلاكية.'
      ],
      landmarks: ['مباشرة فوق استهلاكية التربية', 'مقابل مصلى كلية التربية للطالبات'],
      hasElevator: false,
      wheelchairAccessible: false
    }
  },
  {
    id: 'prayer_edu_female',
    name: 'مصلى كلية التربية للطالبات',
    nameEn: 'College of Education Female Prayer Room',
    code: 'EDU-PRAYER-F',
    category: 'service',
    parentBuildingId: 'col_education',
    parentBuildingName: 'كلية التربية',
    hasMapPin: false,
    floor: 'الطابق العلوي',
    description: 'في الطابق العلوي مقابل استراحة التربية للطالبات.',
    tags: ['مصلى', 'طالبات', 'صلاة', 'تربية', 'وضوء'],
    badge: 'مصلى طالبات 🕌',
    indoorDirections: {
      entrance: 'مدخل مبنى الاستراحة والاستهلاكية',
      floorLevel: 'الطابق العلوي',
      steps: [
        'اصعد الدرج إلى الطابق العلوي فوق استهلاكية التربية.',
        'المصلى يقع مباشرة بالجهة المقابلة لاستراحة التربية للطالبات.'
      ],
      landmarks: ['مقابل استراحة التربية للطالبات في الطابق العلوي'],
      hasElevator: false,
      wheelchairAccessible: false
    }
  },

  // =================== مرافق كلية الآداب (مصلى، استراحة، استهلاكية) ===================
  {
    id: 'prayer_arts',
    name: 'مصلى كلية الآداب',
    nameEn: 'College of Arts Prayer Room',
    code: 'ARTS-PRAYER',
    category: 'service',
    parentBuildingId: 'col_arts',
    parentBuildingName: 'كلية الآداب والعلوم الاجتماعية',
    hasMapPin: false,
    floor: 'الطابق الثاني',
    description: 'في الطابق الثاني على يمين المصعد مباشرة.',
    tags: ['مصلى', 'آداب', 'صلاة', 'الطابق الثاني', 'يمين المصعد'],
    badge: 'مصلى الكلية 🕌',
    indoorDirections: {
      entrance: 'بوابة كلية الآداب الرئيسية',
      floorLevel: 'الطابق الثاني (2nd Floor)',
      steps: [
        'ادخل من البوابة الرئيسية لكلية الآداب.',
        'اصعد بالمصعد إلى الطابق الثاني.',
        'فور خروجك من المصعد، ستجد المصلى على يمينك مباشرة.'
      ],
      landmarks: ['على يمين المصعد مباشرة في الطابق الثاني'],
      hasElevator: true,
      wheelchairAccessible: true
    }
  },
  {
    id: 'lounge_arts',
    name: 'استراحة كلية الآداب',
    nameEn: 'College of Arts Student Lounge',
    code: 'ARTS-LOUNGE',
    category: 'lounge',
    parentBuildingId: 'col_arts',
    parentBuildingName: 'كلية الآداب والعلوم الاجتماعية',
    hasMapPin: false,
    floor: 'الطابق الثاني',
    description: 'في الطابق الثاني من يسار المصعد ثم اليمين ستكون الاستراحة أمامك بعد عدة انحناءات.',
    tags: ['استراحة', 'آداب', 'مذاكرة', 'جلسات', 'الطابق الثاني'],
    badge: 'استراحة الكلية 🛋️',
    indoorDirections: {
      entrance: 'بوابة كلية الآداب الرئيسية',
      floorLevel: 'الطابق الثاني (2nd Floor)',
      steps: [
        'اصعد بالمصعد إلى الطابق الثاني في كلية الآداب.',
        'عند الخروج من المصعد، اتجه نحو اليسار.',
        'ثم انعطف يميناً وتابع السير في الممر.',
        'ستكون الاستراحة أمامك مباشرة بعد عدة انحناءات في الممر.'
      ],
      landmarks: ['يسار المصعد ثم يميناً بعد عدة انحناءات في الممر'],
      hasElevator: true,
      wheelchairAccessible: true
    }
  },
  {
    id: 'store_arts',
    name: 'استهلاكية كلية الآداب والعلوم الاجتماعية',
    nameEn: 'College of Arts Consumer Store',
    code: 'ARTS-STORE',
    category: 'store',
    parentBuildingId: 'col_arts',
    parentBuildingName: 'كلية الآداب والعلوم الاجتماعية',
    hasMapPin: false,
    floor: 'الطابق الأرضي',
    description: 'استهلاكية ومقصف كلية الآداب، توفر الوجبات الخفيفة والمشروبات والقرطاسية لطلبة الكلية.',
    tags: ['استهلاكية', 'آداب', 'مقصف', 'مأكولات', 'قرطاسية'],
    badge: 'استهلاكية الكلية 🛒',
    indoorDirections: {
      entrance: 'المدخل الرئيسي لكلية الآداب',
      floorLevel: 'الطابق الأرضي',
      steps: [
        'ادخل من البوابة الرئيسية لكلية الآداب.',
        'اتجه عبر البهو الرئيسي إلى الرواق الخدمي للكلية.',
        'ستجد الاستهلاكية المخصصة لخدمة الطلبة.'
      ],
      landmarks: ['داخل مبنى كلية الآداب بالطابق الأرضي'],
      hasElevator: false,
      wheelchairAccessible: true
    }
  },

  // =================== مرافق كلية الحقوق (مصلى، استراحة، استهلاكية، قاعات 10 و 11) ===================
  {
    id: 'prayer_lounge_law',
    name: 'مصلى واستراحة كلية الحقوق (اللوبي)',
    nameEn: 'Faculty of Law Lounge & Prayer Area',
    code: 'LAW-LOUNGE',
    category: 'lounge',
    parentBuildingId: 'col_law',
    parentBuildingName: 'كلية الحقوق',
    hasMapPin: false,
    floor: 'الطابق الثاني (اللوبي)',
    description: 'المصلى في الاستراحة في الطابق ٢ في اللوبي.',
    tags: ['استراحة', 'مصلى', 'حقوق', 'لوبي', 'الطابق 2'],
    badge: 'استراحة ومصلى اللوبي 🛋️',
    indoorDirections: {
      entrance: 'المدخل الرئيسي لكلية الحقوق',
      floorLevel: 'الطابق الثاني (اللوبي)',
      steps: [
        'ادخل من المدخل الرئيسي لكلية الحقوق.',
        'اصعد عبر الدرج أو المصعد إلى الطابق الثاني (منطقة اللوبي).',
        'يقع المصلى داخل منطقة الاستراحة في اللوبي مباشرة.'
      ],
      landmarks: ['في بهو/لوبي الطابق الثاني بكلية الحقوق'],
      hasElevator: true,
      wheelchairAccessible: true
    }
  },
  {
    id: 'store_law',
    name: 'استهلاكية كلية الحقوق',
    nameEn: 'Faculty of Law Consumer Store',
    code: 'LAW-STORE',
    category: 'store',
    parentBuildingId: 'col_law',
    parentBuildingName: 'كلية الحقوق',
    hasMapPin: false,
    floor: 'الطابق الأرضي (الواجهة الخارجية)',
    description: 'جهة اليسار إذا جئت من أمام الكلية.',
    tags: ['استهلاكية', 'حقوق', 'مقصف', 'مأكولات', 'قرطاسية'],
    badge: 'استهلاكية الكلية 🛒',
    indoorDirections: {
      entrance: 'الواجهة الأمامية لكلية الحقوق',
      floorLevel: 'الطابق الأرضي',
      steps: [
        'قف أمام مبنى كلية الحقوق من الجهة الأمامية الخارجية.',
        'اتجه نحو جهة اليسار.',
        'ستجد الاستهلاكية أمامك على يدك اليسرى مباشرة.'
      ],
      landmarks: ['جهة اليسار إذا جئت من أمام كلية الحقوق'],
      hasElevator: false,
      wheelchairAccessible: true
    }
  },
  {
    id: 'hall_law_10',
    name: 'قاعة محاضرات 10 - كلية الحقوق',
    nameEn: 'Lecture Hall 10 - Law',
    code: 'LAW-10',
    category: 'hall',
    parentBuildingId: 'col_law',
    parentBuildingName: 'كلية الحقوق',
    hasMapPin: false,
    floor: 'ممر قاعات المحاضرات',
    description: 'قاعة محاضرات دراسية تتسع لنحو 60 طالباً، تقع بجوار قاعة 11 في كلية الحقوق.',
    tags: ['10', 'قاعة 10', 'حقوق 10', 'محاضرات'],
    badge: 'قاعة محاضرات 🚪',
    indoorDirections: {
      entrance: 'المدخل الرئيسي لكلية الحقوق',
      floorLevel: 'ممر القاعات الدراسية',
      steps: [
        'ادخل من المدخل الرئيسي للكلية.',
        'اتجه إلى ممر قاعات المحاضرات.',
        'قاعة 10 تقع مباشرة بجوار قاعة 11.'
      ],
      landmarks: ['بجوار قاعة 11 مباشرة'],
      hasElevator: true,
      wheelchairAccessible: true
    }
  },
  {
    id: 'hall_law_11',
    name: 'قاعة محاضرات 11 - كلية الحقوق',
    nameEn: 'Lecture Hall 11 - Law',
    code: 'LAW-11',
    category: 'hall',
    parentBuildingId: 'col_law',
    parentBuildingName: 'كلية الحقوق',
    hasMapPin: false,
    floor: 'ممر قاعات المحاضرات',
    description: 'قاعة محاضرات دراسية مجهزة، تقع بجوار قاعة 10 في كلية الحقوق.',
    tags: ['11', 'قاعة 11', 'حقوق 11', 'محاضرات'],
    badge: 'قاعة محاضرات 🚪',
    indoorDirections: {
      entrance: 'المدخل الرئيسي لكلية الحقوق',
      floorLevel: 'ممر القاعات الدراسية',
      steps: [
        'ادخل من المدخل الرئيسي للكلية.',
        'اتجه إلى ممر قاعات المحاضرات.',
        'قاعة 11 تقع مباشرة بجوار قاعة 10.'
      ],
      landmarks: ['بجوار قاعة 10 مباشرة'],
      hasElevator: true,
      wheelchairAccessible: true
    }
  },

  // =================== استهلاكيات بقية الكليات (وصف داخلي فقط) ===================
  {
    id: 'store_science',
    name: 'استهلاكية كلية العلوم (COS)',
    nameEn: 'College of Science Consumer Store',
    code: 'SCI-STORE',
    category: 'store',
    parentBuildingId: 'col_science',
    parentBuildingName: 'كلية العلوم',
    hasMapPin: false,
    floor: 'الطابق الأرضي',
    description: 'استهلاكية ومقصف كلية العلوم، توفر الوجبات الخفيفة والمشروبات والقرطاسية للطلبة.',
    tags: ['استهلاكية', 'علوم', 'cos', 'مقصف'],
    badge: 'استهلاكية الكلية 🛒',
    indoorDirections: {
      entrance: 'المدخل الشرقي لمبنى كلية العلوم',
      floorLevel: 'الطابق الأرضي',
      steps: [
        'ادخل من البوابة الشرقية لكلية العلوم.',
        'ستجد مقصف واستهلاكية الكلية لخدمة الطلبة.'
      ],
      landmarks: ['داخل مبنى كلية العلوم بالطابق الأرضي'],
      hasElevator: false,
      wheelchairAccessible: true
    }
  },
  {
    id: 'store_ceps',
    name: 'استهلاكية كلية الاقتصاد والعلوم السياسية (CEPS)',
    nameEn: 'CEPS Consumer Store',
    code: 'CEPS-STORE',
    category: 'store',
    parentBuildingId: 'col_ceps',
    parentBuildingName: 'كلية الاقتصاد والعلوم السياسية',
    hasMapPin: false,
    floor: 'الطابق الأرضي',
    description: 'استهلاكية ومقصف كلية الاقتصاد والعلوم السياسية لخدمة طلبة الكلية.',
    tags: ['استهلاكية', 'تجارة', 'اقتصاد', 'ceps', 'مقصف'],
    badge: 'استهلاكية الكلية 🛒',
    indoorDirections: {
      entrance: 'المدخل الرئيسي لكلية الاقتصاد',
      floorLevel: 'الطابق الأرضي (مستوى البهو)',
      steps: [
        'ادخل من البوابة الدوارة لبهو كلية الاقتصاد.',
        'سر في الرواق باتجاه الجناح الغربي.',
        'ستجد منفذ الاستهلاكية لخدمة الطلبة.'
      ],
      landmarks: ['في بهو كلية التجارة والاقتصاد'],
      hasElevator: false,
      wheelchairAccessible: true
    }
  },
  {
    id: 'store_eng',
    name: 'استهلاكية كلية الهندسة',
    nameEn: 'College of Engineering Consumer Store',
    code: 'ENG-STORE',
    category: 'store',
    parentBuildingId: 'col_engineering',
    parentBuildingName: 'كلية الهندسة',
    hasMapPin: false,
    floor: 'الطابق الأرضي',
    description: 'استهلاكية مجمع كلية الهندسة، توفر المستلزمات الهندسية والوجبات الخفيفة للطلبة.',
    tags: ['استهلاكية', 'هندسة', 'مقصف', 'قرطاسية'],
    badge: 'استهلاكية الكلية 🛒',
    indoorDirections: {
      entrance: 'مجمع مباني كلية الهندسة',
      floorLevel: 'الطابق الأرضي',
      steps: [
        'ادخل من المدخل الرئيسي لكلية الهندسة.',
        'اتجه نحو الرواق الخدمي للطلبة.'
      ],
      landmarks: ['داخل مبنى كلية الهندسة'],
      hasElevator: false,
      wheelchairAccessible: true
    }
  },
  {
    id: 'store_agri',
    name: 'استهلاكية كلية العلوم الزراعية والبحرية',
    nameEn: 'CAMS Consumer Store',
    code: 'AGRI-STORE',
    category: 'store',
    parentBuildingId: 'col_agri',
    parentBuildingName: 'كلية العلوم الزراعية والبحرية',
    hasMapPin: false,
    floor: 'الطابق الأرضي',
    description: 'استهلاكية كلية الزراعة لخدمة الطلبة والموظفين بالوجبات الخفيفة والمشروبات.',
    tags: ['استهلاكية', 'زراعة', 'مقصف'],
    badge: 'استهلاكية الكلية 🛒',
    indoorDirections: {
      entrance: 'المدخل الرئيسي لكلية العلوم الزراعية والبحرية',
      floorLevel: 'الطابق الأرضي',
      steps: [
        'ادخل من البوابة الرئيسية للكلية.',
        'ستجد الاستهلاكية في المنطقة الخدمية بالطابق الأرضي.'
      ],
      landmarks: ['داخل مبنى كلية الزراعة'],
      hasElevator: false,
      wheelchairAccessible: true
    }
  },
  {
    id: 'store_med',
    name: 'استهلاكية كلية الطب والعلوم الصحية',
    nameEn: 'College of Medicine Consumer Store',
    code: 'MED-STORE',
    category: 'store',
    parentBuildingId: 'col_med',
    parentBuildingName: 'كلية الطب والعلوم الصحية',
    hasMapPin: false,
    floor: 'الطابق الأرضي',
    description: 'استهلاكية ومقصف كلية الطب والعلوم الصحية لخدمة طلبة الطب.',
    tags: ['استهلاكية', 'طب', 'مقصف'],
    badge: 'استهلاكية الكلية 🛒',
    indoorDirections: {
      entrance: 'المدخل الرئيسي لكلية الطب والعلوم الصحية',
      floorLevel: 'الطابق الأرضي',
      steps: [
        'ادخل من مدخل كلية الطب.',
        'ستجد الاستهلاكية المخصصة للطلبة بالطابق الأرضي.'
      ],
      landmarks: ['بمبنى كلية الطب قرب المستشفى'],
      hasElevator: false,
      wheelchairAccessible: true
    }
  }
];


// Campus Bus Routes: ONLY TWO ROUTES (المسار الأحمر والمسار الأخضر)
export const SQU_BUS_ROUTES: BusRoute[] = [
  {
    id: 'route_red',
    name: 'المسار الأحمر (Red Route)',
    nameEn: 'Red Route',
    color: '#dc2626',
    operatingHours: '07:14 ص - 04:35 م',
    frequency: 'حافلات متتابعة طوال اليوم الدراسي',
    description: 'يخدم مجمعات السكنات 1، 2، 3 وكليات الحقوق، الطب، الزراعة، التربية، ومحطة الآداب ومركز الخدمات.',
    femaleRoute: {
      direct: {
        title: 'مسار أحمر طالبات (المسار المباشر)',
        stops: [
          'مجمع 1',
          'مجمع 2',
          'مجمع 3',
          'كلية الحقوق',
          'المكتبة الثقافية',
          'مبنى الإدارة (قرب مركز الدراسات التحضيرية)',
          'كلية الطب',
          'كلية الزراعة',
          'كلية التربية',
          'مروراً جنب كلية العلوم',
          'محطة الآداب'
        ]
      },
      reverse: {
        title: 'مسار أحمر طالبات (عكس المسار)',
        stops: [
          'مجمع 1',
          'مجمع 2',
          'مجمع 3',
          'من ثم يذهب إلى محطة الآداب',
          'مروراً بمجمع 2',
          'مجمع 1',
          'وصولاً إلى محطة الآداب'
        ]
      },
      commercialNote: 'اللي تريد المركز التجاري من طالبات مسار أحمر فعليهن الوقوف قبل دوار العلوم.'
    },
    maleRoute: {
      direct: {
        title: 'مسار أحمر طلبة',
        stops: [
          'مركز الخدمات',
          'كلية التمريض',
          'كلية الحقوق',
          'المكتبة الثقافية',
          'مروراً إلى مبنى الإدارة',
          'كلية الطب',
          'كلية الزراعة',
          'كلية التربية',
          'مروراً جنب كلية العلوم',
          'إلى مركز الخدمات'
        ]
      }
    }
  },
  {
    id: 'route_green',
    name: 'المسار الأخضر (Green Route)',
    nameEn: 'Green Route',
    color: '#16a34a',
    operatingHours: '07:14 ص - 04:35 م',
    frequency: 'حافلات متتابعة طوال اليوم الدراسي',
    description: 'يخدم مجمعات السكنات 4، 5 وكليات العلوم، مباني الهندسة، مركز الدراسات التحضيرية، الإدارة، والحقوق.',
    femaleRoute: {
      direct: {
        title: 'مسار أخضر طالبات (المسار المباشر)',
        stops: [
          'مجمع 4',
          'مجمع 5',
          'محطة الآداب',
          'كلية العلوم',
          'مروراً بمباني كلية الهندسة',
          'مركز الدراسات التحضيرية',
          'مروراً من أمام الإدارة',
          'كلية الحقوق',
          'المكتبة الثقافية',
          'مجمع 4'
        ]
      },
      reverse: {
        title: 'مسار أخضر طالبات (عكس المسار)',
        stops: [
          'مجمع 4',
          'مجمع 5',
          'محطة الآداب',
          'كلية العلوم',
          'مروراً بمباني كلية الهندسة',
          'مركز الدراسات التحضيرية',
          'مجمع 4',
          'مجمع 5'
        ]
      },
      commercialNote: 'أما مسار أخضر طالبات اللي تريد التجاري الوقوف أمام كلية العلوم (لأنه التوقف أمام الخدمات والمركز التجاري منعاً باتاً).'
    },
    maleRoute: {
      direct: {
        title: 'مسار أخضر طلبة',
        stops: [
          'مركز الخدمات',
          'كلية العلوم',
          'مروراً بمباني كلية الهندسة',
          'مروراً مركز الدراسات التحضيرية',
          'مروراً أمام مبنى الإدارة',
          'إلى كلية الحقوق',
          'المكتبة الثقافية',
          'رجوع إلى مركز الدراسات التحضيرية',
          'مروراً أمام مباني الهندسة',
          'كلية العلوم',
          'وينتهي في مواقف مركز الخدمات'
        ]
      }
    }
  }
];

// Campus Emergency numbers
export const EMERGENCY_CONTACTS = [
  {
    title: 'أمن وحراسة الحرم الجامعي',
    titleEn: 'Campus Security & Guard Service',
    number: '2414 7777',
    description: 'متوفر على مدار 24 ساعة للمساعدات الأمنية وفقدان المقتنيات وتصاريح الدخول.',
    badge: 'طوارئ أمنية',
    color: 'bg-amber-600'
  },
  {
    title: 'طوارئ مستشفى الجامعة (SQUH ER)',
    titleEn: 'SQU Hospital Emergency Room',
    number: '2414 4444',
    description: 'استقبال الحالات الطبية الطارئة والحوادث والإصابات فورا.',
    badge: 'طوارئ طبية',
    color: 'bg-rose-600'
  },
  {
    title: 'الدعم الفني ونظم المعلومات (CIS)',
    titleEn: 'IT Support & Systems Helpdesk',
    number: '2414 2222',
    description: 'مشاكل البريد الجامعي، تسجيل المقررات، وشبكة الإنترنت بالجامعة.',
    badge: 'دعم تقني',
    color: 'bg-blue-600'
  },
  {
    title: 'عمادة شؤون الطلاب (الاستعلامات)',
    titleEn: 'Deanship of Student Affairs',
    number: '2414 1800',
    description: 'الإرشاد والتوجيه والاستفسارات الأكاديمية والخدمات الاجتماعية.',
    badge: 'خدمات طلابية',
    color: 'bg-emerald-600'
  }
];

// Helper to calculate distance in meters between two lat/lng points
export function calculateDistanceMeters(
  coords1: [number, number],
  coords2: [number, number]
): number {
  const [lat1, lon1] = coords1;
  const [lat2, lon2] = coords2;
  const R = 6371e3; // Earth radius in meters
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
  const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(R * c);
}

// Estimate walking time in minutes (assuming average walking speed ~ 4.5 km/h ≈ 75 m/min)
export function estimateWalkMinutes(distanceMeters: number): number {
  const minutes = Math.ceil(distanceMeters / 75);
  return Math.max(1, minutes);
}

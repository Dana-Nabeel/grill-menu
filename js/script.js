/* Grill BBQ – shared script (index.html + contact.html) */

// ---------- selectors ----------
const menuGrid = document.querySelector("#menuGrid");
const filters = document.querySelector("#filters");
const searchInput = document.querySelector("#searchInput");
const noResults = document.querySelector("#noResults");
const customModal = document.querySelector("#customModal");
const customBody = document.querySelector("#customBody");
const cartModal = document.querySelector("#cartModal");
const cartBody = document.querySelector("#cartBody");
const cartFoot = document.querySelector("#cartFoot");
const cartBtn = document.querySelector("#cartBtn");
const cartCount = document.querySelector("#cartCount");
const cartTotal = document.querySelector("#cartTotal");
const cartSum = document.querySelector("#cartSum");
const langBtn = document.querySelector(".lang-btn");
const workingTime = document.querySelector(".workingTime");
const workingModal = document.querySelector("#workingModal");
const registeringBox = document.querySelector(
  ".contact-form form .signup-form",
);
const loginBox = document.querySelector(".contact-form form .login-form");

// ---------- small helpers ----------
// escape text before putting it inside innerHTML
const esc = (s) =>
  String(s).replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );

// localStorage with try/catch
const getData = (key, def) => {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? def;
  } catch {
    return def;
  }
};
const setData = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
};

// money: work with integers (agorot) to avoid float errors
const toCents = (n) => Math.round(n * 100);
const fmt = (c) => `${(c / 100).toFixed(2).padStart(5, "0")} ₪`;

// ---------- translations ----------
const TEXT = {
  en: {
    brand: "Grill BBQ Restaurant",
    login: "LogIn",
    search: "Search the menu…",
    noResults: "No items match your search.",
    all: "All",
    grills: "Grills",
    sandwiches: "Sandwiches",
    snacks: "Snacks",
    desserts: "Desserts",
    drinks: "Drinks",
    rice: "Rice meals",
    mixed: "Mixed grills",
    earays: "Earays",
    totalOrder: "total order",
    workingTime: "Working Time",
    hours: "From 10:30 - To 13:30",
    Saturday: "Saturday",
    Sunday: "Sunday",
    Monday: "Monday",
    Tuesday: "Tuesday",
    Wednesday: "Wednesday",
    Thursday: "Thursday",
    Friday: "Friday",
    addQuick: "Add to cart",
    customize: "Customize order",
    quantity: "Quantity",
    size: "Size",
    extras: "Extras",
    removals: "Remove",
    notes: "Notes",
    notesPh: "e.g. well done, extra spicy…",
    na: "Not available for this item",
    total: "Total",
    addToCart: "Add to cart",
    cart: "Your order",
    empty: "Your cart is empty. Add something tasty!",
    clear: "Clear",
    checkout: "Place order",
    added: "Item added successfully",
    orderDone: "Order placed successfully",
    remove: "Remove",
  },
  ar: {
    brand: "مطعم جريل للمشاوي",
    login: "تسجيل الدخول",
    search: "ابحث في القائمة…",
    noResults: "ما في أصناف مطابقة لبحثك.",
    all: "الكل",
    grills: "مشاوي",
    sandwiches: "ساندويشات",
    snacks: "سناكات",
    desserts: "حلويات",
    drinks: "مشروبات",
    rice: "عيوش",
    mixed: "مشاوي مشكل",
    earays: "عرايس",
    totalOrder: "إجمالي الطلب",
    workingTime: "أوقات الدوام",
    hours: "من 10:30 إلى 13:30",
    Saturday: "السبت",
    Sunday: "الأحد",
    Monday: "الإثنين",
    Tuesday: "الثلاثاء",
    Wednesday: "الأربعاء",
    Thursday: "الخميس",
    Friday: "الجمعة",
    addQuick: "أضف للسلة",
    customize: "تخصيص الطلب",
    quantity: "الكمية",
    size: "الحجم",
    extras: "إضافات",
    removals: "بدون",
    notes: "ملاحظات",
    notesPh: "مثلاً: مستوي زيادة، حار…",
    na: "غير متاح لهذا الصنف",
    total: "المجموع",
    addToCart: "أضف للسلة",
    cart: "طلبك",
    empty: "السلة فاضية. أضف شي لذيذ!",
    clear: "تفريغ",
    checkout: "تأكيد الطلب",
    added: "تمت إضافة الصنف",
    orderDone: "تم إرسال الطلب بنجاح",
    remove: "حذف",
  },
};
let lang = getData("grill_lang", "en");
const t = (key) => TEXT[lang][key] ?? TEXT.en[key] ?? key; // text by key
const tr = (obj) => obj[lang] ?? obj.en; // {en, ar} object

// ---------- menu data ----------
// default options for each category (empty list = section disabled in the modal)
const sizes = [
  { id: "r", label: { en: "Regular", ar: "عادي" }, delta: 0 },
  { id: "l", label: { en: "Large", ar: "كبير" }, delta: 3 },
];
const noOnion = { id: "onion", label: { en: "No onion", ar: "بدون بصل" } };

const DEFAULTS = {
  grills: {
    sizes: [],
    extras: [
      { id: "garlic", label: { en: "Garlic sauce", ar: "ثومية" }, price: 2 },
      {
        id: "fries",
        label: { en: "Extra fries", ar: "بطاطا إضافية" },
        price: 4,
      },
      {
        id: "veg",
        label: { en: "Grilled vegetables", ar: "خضار مشوية" },
        price: 5,
      },
    ],
    removals: [
      noOnion,
      { id: "sumac", label: { en: "No sumac", ar: "بدون سماق" } },
    ],
  },
  sandwiches: {
    sizes: sizes,
    extras: [
      { id: "sauce", label: { en: "Extra sauce", ar: "صوص إضافي" }, price: 1 },
      { id: "cheese", label: { en: "Cheese", ar: "جبنة" }, price: 2 },
    ],
    removals: [
      noOnion,
      { id: "tomato", label: { en: "No tomato", ar: "بدون بندورة" } },
      { id: "potato", label: { en: "No potatoes", ar: "بدون بطاطا" } },
      { id: "tahini", label: { en: "No tahini", ar: "بدون طحينة" } },
    ],
  },
  snacks: {
    sizes: sizes,
    extras: [],
    removals: [
      noOnion,
      { id: "lemon", label: { en: "No lemon", ar: "بدون ليمون" } },
    ],
  },
  desserts: {
    sizes: [],
    extras: [
      {
        id: "choc",
        label: { en: "Chocolate sauce", ar: "صوص شوكولاتة" },
        price: 1,
      },
      {
        id: "scoop",
        label: { en: "Ice cream scoop", ar: "كرة آيس كريم" },
        price: 3,
      },
    ],
    removals: [],
  },
  drinks: {
    sizes: sizes,
    extras: [],
    removals: [{ id: "ice", label: { en: "No ice", ar: "بدون ثلج" } }],
  },
  // new categories from the API: no options yet, fill them when you need
  rice: { sizes: [], extras: [], removals: [] },
  mixed: { sizes: [], extras: [], removals: [] },
  earays: { sizes: [], extras: [], removals: [] },
};
const CATS = Object.keys(DEFAULTS);

// ---------- local menu (backup) ----------
// the real menu comes from the API, this one is used only if the API is not available
// price = ₪ | discount = % (optional) | img = file inside /images
// "options" on an item overrides the category defaults
const sandwichDesc = {
  en: "Served with our special tahini sauce, potatoes, tomato slices, parsley, onions and sumac",
  ar: "يُقدَّم مع طحينة خاصة، بطاطا، شرائح بندورة، بقدونس، بصل وسماق",
};

const MENU = [
  {
    id: "mix-grill",
    category: "grills",
    price: 50,
    img: "mixed grill.jpg",
    name: { en: "Mix grill", ar: "ميكس جريل" },
    desc: {
      en: "A meal consisting of 950 grams of kebab, shaqaf and ribs",
      ar: "وجبة بوزن 950 غرام من الكباب والشقاف والريش",
    },
  },
  {
    id: "mix-kebab",
    category: "grills",
    price: 45,
    img: "mixed kebab.jfif",
    name: { en: "Mix kebab", ar: "ميكس كباب" },
    desc: {
      en: "4 skewers of fresh kebab (2 meat, 2 chicken) with sumac onion salad, grilled vegetables, potatoes and tahini",
      ar: "4 أسياخ كباب طازج (2 لحم و2 دجاج) مع سلطة بصل بالسماق، خضار مشوية، بطاطا وطحينة",
    },
  },
  {
    id: "meat-feathers",
    category: "grills",
    price: 50,
    img: "meat feathers.jfif",
    name: { en: "Meat feathers", ar: "ريش لحم" },
    desc: {
      en: "5 pieces of local lamb ribs with sumac onion salad, potatoes and tahini",
      ar: "5 قطع ريش غنم بلدي مع سلطة بصل بالسماق، بطاطا وطحينة",
    },
  },
  {
    id: "chicken-pieces",
    category: "grills",
    price: 35,
    discount: 5,
    img: "chicken pieces.jpg",
    name: { en: "Chicken pieces with bones", ar: "قطع دجاج بالعظم" },
    desc: {
      en: "6 pieces of fresh chicken in a special marinade, with potatoes and sauce",
      ar: "6 قطع دجاج طازج بتتبيلة خاصة مع بطاطا وصوص",
    },
  },

  {
    id: "shawarma",
    category: "sandwiches",
    price: 10,
    img: "shawema.jfif",
    name: { en: "Shawarma sandwich", ar: "ساندويش شاورما" },
    desc: sandwichDesc,
  },
  {
    id: "kebab-sandwich",
    category: "sandwiches",
    price: 10,
    img: "kebab sandwech.jfif",
    name: { en: "Kebab sandwich", ar: "ساندويش كباب" },
    desc: sandwichDesc,
  },
  {
    id: "shish-tawook",
    category: "sandwiches",
    price: 10,
    img: "shish tawook.jfif",
    name: { en: "Shish Tawook sandwich", ar: "ساندويش شيش طاووق" },
    desc: sandwichDesc,
  },
  {
    id: "beef-joint",
    category: "sandwiches",
    price: 15,
    img: "kebab sandwech.jfif",
    name: { en: "Beef joint sandwich", ar: "ساندويش مفصّل لحم" },
    desc: sandwichDesc,
  },

  {
    id: "green-salad",
    category: "snacks",
    price: 5,
    img: "green salad.jpg",
    name: { en: "Green salad", ar: "سلطة خضراء" },
    desc: {
      en: "Tomato, cucumber, onion, lettuce, watercress",
      ar: "بندورة، خيار، بصل، خس وجرجير",
    },
  },
  {
    id: "tabbouleh",
    category: "snacks",
    price: 5,
    img: "tabbouleh.jpg",
    name: { en: "Tabbouleh", ar: "تبولة" },
    desc: {
      en: "Levantine salad: parsley, bulgur, tomatoes, onions, pomegranate, lemon and sumac",
      ar: "سلطة شامية: بقدونس، برغل، بندورة، بصل، رمان، ليمون وسماق",
    },
  },
  {
    id: "turkish-salad",
    category: "snacks",
    price: 5,
    img: "turkish salad.jpg",
    name: { en: "Turkish salad", ar: "سلطة تركية" },
    desc: {
      en: "Red pepper, pomegranate molasses, hot pepper, onion, cucumber",
      ar: "فلفل أحمر، دبس رمان، فلفل حار، بصل وخيار",
    },
  },
  {
    id: "fattoush",
    category: "snacks",
    price: 5,
    img: "fattoush.jpg",
    name: { en: "Fattoush", ar: "فتوش" },
    desc: {
      en: "Tomatoes, cucumber, carrots, sumac, toasted bread",
      ar: "بندورة، خيار، جزر، سماق وخبز محمص",
    },
    options: {
      extras: [
        {
          id: "toast",
          label: { en: "Extra toast", ar: "خبز محمص إضافي" },
          price: 1,
        },
      ],
    },
  },

  {
    id: "cheesecake",
    category: "desserts",
    price: 7,
    img: "craemy caramel.jfif",
    name: { en: "Cheesecake", ar: "تشيز كيك" },
    desc: { en: "Sweet, cold and delicious", ar: "حلوى باردة، حلوة ولذيذة" },
  },
  {
    id: "molten-cake",
    category: "desserts",
    price: 15,
    img: "molten cake.jpg",
    name: { en: "Molten cake", ar: "مولتن كيك" },
    desc: {
      en: "Cake with ice cream and chocolate sauce",
      ar: "كيكة مع آيس كريم وصوص الشوكولاتة",
    },
  },
  {
    id: "milk-cake",
    category: "desserts",
    price: 7,
    img: "milk cake.jfif",
    name: { en: "Milk cake", ar: "كيكة الحليب" },
    desc: { en: "Turkish milk cake", ar: "كيكة الحليب التركية" },
  },
  {
    id: "craemy-caramel",
    category: "desserts",
    price: 5,
    img: "craemy caramel.jfif",
    name: { en: "craemy caramel", ar: "كريمة كراميل" },
    desc: { en: "Cold craemy caramel pudding", ar: "بودنغ كراميل كريمي بارد" },
  },

  {
    id: "coca-cola",
    category: "drinks",
    price: 5,
    img: "coca cola.jfif",
    name: { en: "Coca cola", ar: "كوكا كولا" },
    desc: { en: "Soft drink served cold", ar: "مشروب غازي يُقدَّم بارداً" },
  },
  {
    id: "mint-lemonade",
    category: "drinks",
    price: 10,
    img: "mint lemonade.jfif",
    name: { en: "Mint lemonade", ar: "ليمون بالنعنع" },
    desc: { en: "Fresh lemon and mint juice", ar: "عصير ليمون ونعنع طازج" },
    options: {
      removals: [
        { id: "ice", label: { en: "No ice", ar: "بدون ثلج" } },
        { id: "sugar", label: { en: "No sugar", ar: "بدون سكر" } },
      ],
    },
  },
];

let ITEMS = [];

// image: photo from the API if there is one, otherwise the local image
const imgSrc = (item) => item.photo || `images/${item.img}`;

// ---------- menu.mohamednaji.com API ----------
const API_URL = "https://menu.mohamednaji.com/api";

// our category key => category ids in the API (grills + "Grills" #8 are shown in one tab)
const CATEGORY_IDS = {
  grills: [1, 8],
  sandwiches: [2],
  snacks: [3],
  desserts: [4],
  drinks: [5],
  rice: [7],
  mixed: [9],
  earays: [10],
};
const categoryKey = (id) => CATS.find((key) => CATEGORY_IDS[key].includes(id));

// options that are not in the API (matched by the English name, lowercase)
const ITEM_OPTIONS = {
  fattoush: {
    extras: [
      {
        id: "toast",
        label: { en: "Extra toast", ar: "خبز محمص إضافي" },
        price: 1,
      },
    ],
  },
  "kenza cola 330ml": { sizes: [] },
  "palestine cola 330ml": { sizes: [] },
};

const getJSON = async (path) => {
  const res = await fetch(`${API_URL}/${path}`);
  if (!res.ok) throw new Error(res.status);
  return res.json();
};

let apiCategories = {}; // key => { en, ar }

const loadCategories = async () => {
  try {
    const list = await getJSON("categories");
    CATS.forEach((key) => {
      const cat = list.find((c) => c.id === CATEGORY_IDS[key][0]);
      if (cat && cat.name && (cat.name.en || cat.name.ar))
        apiCategories[key] = cat.name;
    });
  } catch (err) {
    // API is down => we use the local names
    console.warn("Categories API is not available, using the local names", err);
  }
};

// tab name: from the API, otherwise from our local texts
const catName = (key) => {
  if (key === "all") return t("all");
  const name = apiCategories[key];
  return (name && (name[lang] || name.en)) || t(key);
};

const loadMenu = async () => {
  await loadCategories();

  let list = [];
  try {
    list = await getJSON("items");
  } catch (err) {
    console.warn("Items API is not available, using the local menu", err);
  }

  if (list.length) {
    ITEMS = list
      .map((a) => {
        const category = categoryKey(a.category_id);
        if (!category) return null; // category we don't show
        const name = a.name || {};
        const desc = a.description || {};
        return {
          id: String(a.id),
          category: category,
          price: parseFloat(a.price) || 0,
          discount: parseFloat(a.discount) || 0, // percent
          photo: a.image,
          name: { en: name.en || "", ar: name.ar || name.en || "" },
          desc: { en: desc.en || "", ar: desc.ar || desc.en || "" },
          // category defaults + the options that are not in the API
          options: {
            ...DEFAULTS[category],
            ...ITEM_OPTIONS[(name.en || "").trim().toLowerCase()],
          },
        };
      })
      .filter(Boolean);
  } else {
    // backup: the local menu
    ITEMS = MENU.map((item) => ({
      ...item,
      options: { ...DEFAULTS[item.category], ...item.options },
    }));
  }
};
const getItem = (id) => ITEMS.find((item) => item.id === id);

// prices
const basePrice = (item) =>
  Math.round(item.price * 100 * (1 - (item.discount || 0) / 100));
const unitPrice = (item, sizeId, extraIds = []) => {
  const size = item.options.sizes.find((s) => s.id === sizeId);
  const sizePrice = size ? toCents(size.delta) : 0;
  const extrasPrice = item.options.extras
    .filter((e) => extraIds.includes(e.id))
    .reduce((sum, e) => sum + toCents(e.price), 0);
  return basePrice(item) + sizePrice + extrasPrice;
};

// ---------- icons ----------
const ICON = {
  cart: '<svg viewBox="0 0 24 24" width="25" height="25" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M14 2C14 1.44772 13.5523 1 13 1C12.4477 1 12 1.44772 12 2V8.58579L9.70711 6.29289C9.31658 5.90237 8.68342 5.90237 8.29289 6.29289C7.90237 6.68342 7.90237 7.31658 8.29289 7.70711L12.2929 11.7071C12.6834 12.0976 13.3166 12.0976 13.7071 11.7071L17.7071 7.70711C18.0976 7.31658 18.0976 6.68342 17.7071 6.29289C17.3166 5.90237 16.6834 5.90237 16.2929 6.29289L14 8.58579V2ZM1 3C1 2.44772 1.44772 2 2 2H2.47241C3.82526 2 5.01074 2.90547 5.3667 4.21065L5.78295 5.73688L7.7638 13H18.236L20.2152 5.73709C20.3604 5.20423 20.9101 4.88998 21.4429 5.03518C21.9758 5.18038 22.29 5.73006 22.1448 6.26291L20.1657 13.5258C19.9285 14.3962 19.1381 15 18.236 15H8V16C8 16.5523 8.44772 17 9 17H16.5H18C18.5523 17 19 17.4477 19 18C19 18.212 18.934 18.4086 18.8215 18.5704C18.9366 18.8578 19 19.1715 19 19.5C19 20.8807 17.8807 22 16.5 22C15.1193 22 14 20.8807 14 19.5C14 19.3288 14.0172 19.1616 14.05 19H10.95C10.9828 19.1616 11 19.3288 11 19.5C11 20.8807 9.88071 22 8.5 22C7.11929 22 6 20.8807 6 19.5C6 18.863 6.23824 18.2816 6.63048 17.8402C6.23533 17.3321 6 16.6935 6 16V14.1339L3.85342 6.26312L3.43717 4.73688C3.31852 4.30182 2.92336 4 2.47241 4H2C1.44772 4 1 3.55228 1 3ZM16 19.5C16 19.2239 16.2239 19 16.5 19C16.7761 19 17 19.2239 17 19.5C17 19.7761 16.7761 20 16.5 20C16.2239 20 16 19.7761 16 19.5ZM8 19.5C8 19.2239 8.22386 19 8.5 19C8.77614 19 9 19.2239 9 19.5C9 19.7761 8.77614 20 8.5 20C8.22386 20 8 19.7761 8 19.5Z" fill="currentColor"></path></svg>',
  custom:
    '<svg viewBox="0 0 24 24" width="25" height="25" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 5.6A2.6 2.6 0 0 1 5.6 3h2.8A2.6 2.6 0 0 1 11 5.6v2.8A2.6 2.6 0 0 1 8.4 11H5.6A2.6 2.6 0 0 1 3 8.4V5.6ZM3 15.6A2.6 2.6 0 0 1 5.6 13h2.8a2.6 2.6 0 0 1 2.6 2.6v2.8A2.6 2.6 0 0 1 8.4 21H5.6A2.6 2.6 0 0 1 3 18.4v-2.8ZM13 5.6A2.6 2.6 0 0 1 15.6 3h2.8A2.6 2.6 0 0 1 21 5.6v2.8a2.6 2.6 0 0 1-2.6 2.6h-2.8A2.6 2.6 0 0 1 13 8.4V5.6ZM17 13a1 1 0 0 1 1 1v2h2a1 1 0 1 1 0 2h-2v2a1 1 0 1 1-2 0v-2h-2a1 1 0 1 1 0-2h2v-2a1 1 0 0 1 1-1Z" fill="currentColor"></path></svg>',
  close:
    '<svg fill="#000" width="24px" height="24px" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><path d="M8.48 16l5.84-5.84c0.32-0.32 0.32-0.84 0-1.2-0.32-0.32-0.84-0.32-1.2 0l-5.84 5.84-5.84-5.84c-0.32-0.32-0.84-0.32-1.2 0-0.32 0.32-0.32 0.84 0 1.2l5.84 5.84-5.84 5.84c-0.32 0.32-0.32 0.84 0 1.2 0.16 0.16 0.4 0.24 0.6 0.24s0.44-0.080 0.6-0.24l5.84-5.84 5.84 5.84c0.16 0.16 0.36 0.24 0.6 0.24 0.2 0 0.44-0.080 0.6-0.24 0.32-0.32 0.32-0.84 0-1.2l-5.84-5.84z"></path></svg>',
  trash:
    '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14"></path></svg>',
};
document
  .querySelectorAll(".close-btn")
  .forEach((btn) => (btn.innerHTML = ICON.close));

// ---------- modals + toast ----------
const openModal = (modal) => {
  modal.classList.remove("d-none");
  document.body.style.overflow = "hidden";
};
const closeModal = (modal) => {
  modal.classList.add("d-none");
  // give the scroll back only if no other modal is open
  if (!document.querySelectorAll("[data-modal]:not(.d-none)").length)
    document.body.style.overflow = "";
};

// close when clicking the blur background or any [data-close] button
document.addEventListener("click", (e) => {
  const modal = e.target.closest("[data-modal]");
  if (modal && (e.target === modal || e.target.closest("[data-close]")))
    closeModal(modal);
});
// close with Escape
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape")
    document.querySelectorAll("[data-modal]:not(.d-none)").forEach(closeModal);
});

const toast = (title) => {
  if (!window.Swal) return;
  Swal.fire({
    position: "top-end",
    toast: true,
    icon: "success",
    title: title,
    showConfirmButton: false,
    timerProgressBar: true,
    timer: 2000,
  });
};

// ---------- menu page ----------
let currentCat = "all";
let searchText = "";
let cart = getData("grill_cart", []);
let custom = null; // the order being customized in the modal
let swapTimer;

const cardHTML = (item, i) => `
  <div class="col-lg-3 col-md-4 col-sm-6 col-12 mb-3 menu-item" style="--i:${i}" data-id="${item.id}">
    <div class="card h-100">
      <div class="card-img">
        <img src="${esc(imgSrc(item))}" loading="lazy" alt="${esc(tr(item.name))}">
        <div class="price-tag">
          <span class="item-price">${fmt(basePrice(item))}</span>
          ${item.discount ? `<span class="old-price">${fmt(toCents(item.price))}</span>` : ""}
        </div>
      </div>
      <div class="card-body">
        <h2 class="card-title text-truncate text-capitalize">${esc(tr(item.name))}</h2>
        <p class="card-text">${esc(tr(item.desc))}</p>
      </div>
      <div class="card-footer">
        <button class="toCart btn" data-act="quick">${ICON.cart}<span>${t("addQuick")}</span></button>
        <button class="custom btn" data-act="custom" aria-label="${t("customize")}">${ICON.custom}</button>
      </div>
    </div>
  </div>`;

// category tabs
const renderTabs = () => {
  const shown = CATS.filter((cat) =>
    ITEMS.some((item) => item.category === cat),
  ); // skip empty categories
  filters.innerHTML = ["all", ...shown]
    .map(
      (cat) =>
        `<li class="${cat === currentCat ? "active " : ""}px-lg-4 px-2 fw-medium"><a href="#" data-cat="${cat}">${esc(catName(cat))}</a></li>`,
    )
    .join("");
};

// items that match the category + search
const getVisibleItems = () => {
  // every searched word must match the START of a word (so "cola" won't match "chocolate")
  const words = searchText.toLowerCase().trim().split(/\s+/).filter(Boolean);
  return ITEMS.filter((item) => {
    const inCat = currentCat === "all" || item.category === currentCat;
    const text = [item.name.en, item.name.ar, item.desc.en, item.desc.ar]
      .join(" ")
      .toLowerCase();
    const itemWords = text.split(/[^\p{L}\p{N}]+/u);
    const inSearch = words.every((w) =>
      itemWords.some((iw) => iw.startsWith(w)),
    );
    return inCat && inSearch;
  });
};

const renderGrid = (animate = true) => {
  const draw = () => {
    const list = getVisibleItems();
    menuGrid.innerHTML = list.map(cardHTML).join("");
    noResults.classList.toggle("d-none", list.length > 0);
    menuGrid.classList.remove("is-switching");
  };
  clearTimeout(swapTimer);
  if (!animate) return draw();
  menuGrid.classList.add("is-switching");
  swapTimer = setTimeout(draw, 160);
};

// ---------- customize modal ----------
// one option (chip) -> radio for size, checkbox for extras / removals
const chipHTML = (type, name, value, label, price, checked) => `
  <label class="chip">
    <input type="${type}" name="${name}" value="${value}" ${checked ? "checked" : ""}>
    <span>${esc(tr(label))}${price ? ` <em>+${fmt(toCents(price))}</em>` : ""}</span>
  </label>`;

// one section (size / extras / removals), disabled if the list is empty
const blockHTML = (title, list, chips) => `
  <fieldset class="opt-block" ${list.length ? "" : "disabled"}>
    <legend class="opt-title">${t(title)}</legend>
    ${list.length ? `<div class="chips">${chips}</div>` : `<div class="opt-na">${t("na")}</div>`}
  </fieldset>`;

const openCustom = (item) => {
  const opt = item.options;
  custom = {
    item: item,
    qty: 1,
    size: opt.sizes[0]?.id ?? null,
    extras: [],
    removals: [],
    notes: "",
  };

  customBody.innerHTML = `
    <div class="d-flex gap-3 align-items-center mb-3">
      <img class="custom-img" src="${esc(imgSrc(item))}" alt="">
      <div><h3 class="h5 mb-1">${esc(tr(item.name))}</h3><small class="text-body-secondary">${esc(tr(item.desc))}</small></div>
    </div>
    <div class="opt-block"><div class="opt-title">${t("quantity")}</div>
      <div class="qty"><button type="button" data-q="-1" aria-label="-">−</button><span id="customQty">1</span><button type="button" data-q="1" aria-label="+">+</button></div>
    </div>
    ${blockHTML("size", opt.sizes, opt.sizes.map((s, i) => chipHTML("radio", "size", s.id, s.label, s.delta, i === 0)).join(""))}
    ${blockHTML("extras", opt.extras, opt.extras.map((e) => chipHTML("checkbox", "extras", e.id, e.label, e.price)).join(""))}
    ${blockHTML("removals", opt.removals, opt.removals.map((r) => chipHTML("checkbox", "removals", r.id, r.label, 0)).join(""))}
    <div class="opt-block"><div class="opt-title">${t("notes")}</div>
      <textarea id="customNotes" class="form-control" rows="2" maxlength="120" placeholder="${t("notesPh")}"></textarea>
    </div>
    <div class="d-flex justify-content-between align-items-center mt-3">
      <div class="fs-5">${t("total")}: <strong id="customTotal"></strong></div>
      <button type="button" class="btn-main" id="customAdd">${t("addToCart")}</button>
    </div>`;

  updateCustom();
  openModal(customModal);
};

// refresh quantity + total inside the modal
const updateCustom = () => {
  document.querySelector("#customQty").textContent = custom.qty;
  document.querySelector("#customTotal").textContent = fmt(
    unitPrice(custom.item, custom.size, custom.extras) * custom.qty,
  );
};

// ---------- cart ----------
const saveCart = () => setData("grill_cart", cart);
const lineUnit = (line) => unitPrice(getItem(line.id), line.size, line.extras);

const addToCart = (item, c = {}) => {
  const line = {
    id: item.id,
    qty: c.qty || 1,
    size: c.size ?? item.options.sizes[0]?.id ?? null,
    extras: [...(c.extras || [])].sort(),
    removals: [...(c.removals || [])].sort(),
    notes: (c.notes || "").trim(),
  };
  // same item + same options => same line, only the quantity grows
  line.key = [line.id, line.size, line.extras, line.removals, line.notes].join(
    "|",
  );
  const same = cart.find((l) => l.key === line.key);
  if (same) same.qty = Math.min(20, same.qty + line.qty);
  else cart.push(line);

  saveCart();
  updateBar();
  toast(t("added"));
};

// total at the bottom bar
const updateBar = () => {
  cartCount.textContent = cart.reduce((sum, l) => sum + l.qty, 0);
  cartTotal.textContent = fmt(
    cart.reduce((sum, l) => sum + lineUnit(l) * l.qty, 0),
  );
};

const renderCart = () => {
  cartFoot.classList.toggle("d-none", !cart.length);
  if (!cart.length) {
    cartBody.innerHTML = `<p class="text-center py-4 mb-0">${t("empty")}</p>`;
    return;
  }
  cartBody.innerHTML = cart
    .map((line) => {
      const item = getItem(line.id);
      const opt = item.options;
      const size = opt.sizes.find((s) => s.id === line.size);
      // small text under the name: size · extras · removals · notes
      const details = [
        size && tr(size.label),
        ...opt.extras
          .filter((e) => line.extras.includes(e.id))
          .map((e) => "+ " + tr(e.label)),
        ...opt.removals
          .filter((r) => line.removals.includes(r.id))
          .map((r) => "− " + tr(r.label)),
        line.notes && `“${line.notes}”`,
      ]
        .filter(Boolean)
        .map(esc)
        .join(" · ");

      return `<div class="cart-row" data-key="${esc(line.key)}">
      <img src="${esc(imgSrc(item))}" alt="">
      <div class="flex-grow-1">
        <div class="fw-medium">${esc(tr(item.name))}</div>
        <small class="text-body-secondary">${details}</small>
        <div class="qty qty-sm mt-1"><button type="button" data-cq="-1">−</button><span>${line.qty}</span><button type="button" data-cq="1">+</button></div>
      </div>
      <div class="text-end"><strong>${fmt(lineUnit(line) * line.qty)}</strong>
        <button type="button" class="cart-rm" data-rm aria-label="${t("remove")}">${ICON.trash}</button></div>
    </div>`;
    })
    .join("");
  cartSum.textContent = cartTotal.textContent;
};

// ---------- item details popup ----------
const showDetails = (item) => {
  if (!window.Swal) return;
  Swal.fire({
    title: esc(tr(item.name)),
    imageUrl: imgSrc(item),
    imageAlt: tr(item.name),
    html: `
      <p class="details-desc">${esc(tr(item.desc))}</p>
      <div class="details-price">
        <span>${fmt(basePrice(item))}</span>
        ${item.discount ? `<s>${fmt(toCents(item.price))}</s>` : ""}
      </div>`,
    showCloseButton: true,
    confirmButtonText: t("addToCart"),
    buttonsStyling: false,
    customClass: {
      popup: "details-popup",
      confirmButton: "details-btn",
    },
  }).then((result) => {
    if (result.isConfirmed) addToCart(item);
  });
};

// ---------- menu events ----------
if (menuGrid) {
  // change category
  filters.onclick = (e) => {
    const link = e.target.closest("[data-cat]");
    if (!link) return;
    e.preventDefault();
    if (currentCat === link.dataset.cat) return;
    currentCat = link.dataset.cat;
    renderTabs();
    renderGrid();
  };

  // search (wait 200ms after typing)
  let searchTimer;
  searchInput.oninput = (e) => {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => {
      searchText = e.target.value;
      renderGrid();
    }, 200);
  };

  // click on the card => details popup | click on a button => add to cart / customize
  menuGrid.onclick = (e) => {
    const card = e.target.closest(".menu-item");
    if (!card) return;
    const item = getItem(card.dataset.id);
    const btn = e.target.closest("[data-act]");

    if (!btn) return showDetails(item);
    if (btn.dataset.act === "quick") addToCart(item);
    else openCustom(item);
  };

  // inside the customize modal
  customBody.onclick = (e) => {
    const qtyBtn = e.target.closest("[data-q]");
    if (qtyBtn) {
      custom.qty = Math.min(20, Math.max(1, custom.qty + +qtyBtn.dataset.q));
      updateCustom();
    }
    if (e.target.closest("#customAdd")) {
      addToCart(custom.item, custom);
      closeModal(customModal);
    }
  };
  customBody.onchange = (e) => {
    const name = e.target.name;
    if (!name) return;
    // size is one value, extras / removals are lists
    if (name === "size") custom.size = e.target.value;
    else
      custom[name] = [
        ...customBody.querySelectorAll(`[name="${name}"]:checked`),
      ].map((input) => input.value);
    updateCustom();
  };
  customBody.oninput = (e) => {
    if (e.target.id === "customNotes") custom.notes = e.target.value;
  };

  // open cart
  cartBtn.onclick = (e) => {
    e.preventDefault();
    renderCart();
    openModal(cartModal);
  };

  // inside the cart modal
  cartModal.onclick = (e) => {
    const row = e.target.closest(".cart-row");
    const line = row && cart.find((l) => l.key === row.dataset.key);
    const qtyBtn = e.target.closest("[data-cq]");

    if (qtyBtn && line) {
      line.qty = Math.min(20, line.qty + +qtyBtn.dataset.cq);
      if (line.qty < 1) cart = cart.filter((l) => l !== line);
    } else if (e.target.closest("[data-rm]") && line)
      cart = cart.filter((l) => l !== line);
    else if (e.target.closest("#clearCart")) cart = [];
    else if (e.target.closest("#checkout")) {
      if (!cart.length) return;
      cart = [];
      saveCart();
      updateBar();
      closeModal(cartModal);
      if (window.Swal)
        Swal.fire({
          icon: "success",
          title: t("orderDone"),
          showConfirmButton: false,
          timer: 1800,
        });
      return;
    } else return;

    saveCart();
    updateBar();
    renderCart();
  };
}

// ---------- language ----------
const applyLang = () => {
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  document
    .querySelectorAll("[data-i18n]")
    .forEach((el) => (el.textContent = t(el.dataset.i18n)));
  document
    .querySelectorAll("[data-i18n-ph]")
    .forEach((el) => (el.placeholder = t(el.dataset.i18nPh)));
  if (langBtn) langBtn.textContent = lang === "ar" ? "EN" : "ع";
  document.title = t("brand");
  if (menuGrid) {
    renderTabs();
    renderGrid(false);
    renderCart();
  }
};

if (langBtn) {
  langBtn.onclick = () => {
    lang = lang === "en" ? "ar" : "en";
    setData("grill_lang", lang);
    applyLang();
  };
}

// ---------- Working Time Modal ----------
if (workingTime && workingModal) {
  workingTime.onclick = () => openModal(workingModal);
  workingTime.onkeydown = (e) => {
    if (e.key === "Enter") openModal(workingModal);
  };

  // highlight today
  const today = new Date().toLocaleDateString("en-US", { weekday: "long" });
  workingModal.querySelectorAll("[data-day]").forEach((day) => {
    if (day.dataset.day === today)
      day.parentElement.style.background = "#eaecf0";
  });
}

// ---------- login & signUp (contact.html) ----------
if (registeringBox) {
  const btnSignUp = document.querySelector(
    ".contact-form form .signup-form .register-btn",
  );
  const toSignUp = document.querySelector(
    ".contact-form form .login-form .toSignUp",
  );

  // toggle to signUp
  toSignUp.onclick = (e) => {
    e.preventDefault();
    loginBox.classList.add("d-none");
    registeringBox.classList.remove("d-none");
  };

  btnSignUp.onclick = (e) => {
    e.preventDefault();
    Swal.fire({
      position: "center",
      toast: false,
      icon: "success",
      title: "Registration completed successfully",
      showConfirmButton: false,
      timerProgressBar: true,
      timer: 1300,
    });
    registeringBox.classList.add("d-none");
    loginBox.classList.remove("d-none");
  };
}

// ---------- start ----------
const start = async () => {
  if (menuGrid) {
    await loadMenu();
    cart = cart.filter((line) => getItem(line.id)); // drop items that are no longer in the menu
  }
  applyLang();
  updateBar();
};
start();

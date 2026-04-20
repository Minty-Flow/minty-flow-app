import type { IconSvgName } from "~/components/ui/icon-svg"

export type MintyIconData = {
  name: IconSvgName
  keywords: string[]
}

export const MINTY_SVGS: MintyIconData[] = [
  // Money & Finance
  { name: "wallet", keywords: ["money", "cash", "payment"] },
  { name: "credit-card", keywords: ["payment", "card", "credit"] },
  { name: "building-bank", keywords: ["banking", "finance", "institution"] },
  { name: "cash-banknote", keywords: ["money", "payment", "dollar"] },
  { name: "cash-banknote-plus", keywords: ["income", "deposit", "add money"] },
  { name: "currency-dollar", keywords: ["dollar", "money", "usd"] },
  { name: "coin-pound", keywords: ["pound", "money", "gbp"] },
  { name: "pig-money", keywords: ["savings", "save", "piggy bank"] },
  { name: "pig", keywords: ["savings", "piggy", "money"] },
  { name: "percentage", keywords: ["discount", "tax", "rate", "interest"] },
  { name: "receipt", keywords: ["bill", "invoice", "receipt"] },
  { name: "briefcase", keywords: ["work", "business", "job"] },

  // Charts & Analytics
  { name: "chart-area-line", keywords: ["graph", "analytics", "trend"] },
  { name: "chart-bar", keywords: ["graph", "analytics", "statistics"] },
  { name: "chart-pie", keywords: ["graph", "analytics", "distribution"] },
  { name: "chart-dots", keywords: ["scatter", "data", "analytics"] },
  { name: "trending-up", keywords: ["growth", "increase", "profit"] },
  { name: "trending-down", keywords: ["loss", "decrease", "decline"] },

  // Tags & Labels
  { name: "tag", keywords: ["label", "category", "price"] },
  { name: "tags", keywords: ["labels", "categories", "tags"] },
  { name: "tag-plus", keywords: ["new tag", "add label", "category"] },

  // Shopping & Retail
  { name: "shopping-cart", keywords: ["shopping", "buy", "purchase"] },
  { name: "basket", keywords: ["shopping", "groceries", "buy"] },
  { name: "gift", keywords: ["present", "surprise", "celebration"] },

  // Food & Drink
  { name: "pizza", keywords: ["food", "eating", "restaurant"] },
  { name: "headphones", keywords: ["music", "audio", "entertainment"] },

  // Transport & Travel
  { name: "car", keywords: ["vehicle", "transport", "auto"] },
  { name: "map-pin", keywords: ["location", "place", "pin"] },
  { name: "map", keywords: ["navigation", "directions", "travel"] },

  // Media & Visual
  { name: "camera", keywords: ["photo", "photography", "picture"] },
  { name: "photo", keywords: ["image", "picture", "gallery"] },
  { name: "video", keywords: ["film", "recording", "media"] },
  { name: "palette", keywords: ["art", "design", "creative"] },

  // Files & Documents
  { name: "file", keywords: ["document", "paper", "file"] },
  { name: "file-description", keywords: ["document", "text", "file"] },
  { name: "file-analytics", keywords: ["report", "data", "analytics"] },
  { name: "presentation", keywords: ["slides", "deck", "meeting"] },
  { name: "clipboard", keywords: ["document", "notes", "list"] },

  // Editing & Writing
  { name: "pencil", keywords: ["write", "edit", "draw"] },

  // Math & Calculation
  { name: "calculator", keywords: ["math", "numbers", "compute"] },
  { name: "plus", keywords: ["add", "new", "create"] },
  { name: "minus", keywords: ["remove", "subtract", "delete"] },
  { name: "divide", keywords: ["division", "math", "split"] },
  { name: "circle-plus", keywords: ["add", "new", "create"] },

  // Devices & System
  { name: "device-desktop", keywords: ["computer", "pc", "desktop"] },
  { name: "device-mobile", keywords: ["phone", "mobile", "cell"] },
  { name: "database", keywords: ["storage", "data", "server"] },
  { name: "settings", keywords: ["config", "gear", "preferences"] },
  { name: "plug", keywords: ["power", "electricity", "utilities"] },
  { name: "refresh", keywords: ["reload", "sync", "update"] },

  // Security
  { name: "lock", keywords: ["security", "secure", "protected"] },
  { name: "fingerprint", keywords: ["biometric", "secure", "identity"] },
  {
    name: "shield-exclamation",
    keywords: ["insurance", "protection", "security"],
  },

  // People & Health
  { name: "user", keywords: ["person", "account", "profile"] },
  { name: "heart", keywords: ["health", "love", "wellness"] },
  { name: "activity", keywords: ["pulse", "activity", "heartbeat"] },

  // Places & Buildings
  { name: "building", keywords: ["office", "work", "corporate"] },
  { name: "building-bridge-2", keywords: ["infrastructure", "bridge", "city"] },
  { name: "school", keywords: ["education", "learning", "academy"] },

  // Alerts & Status
  { name: "alert-circle", keywords: ["warning", "alert", "attention"] },
  { name: "alert-triangle", keywords: ["warning", "danger", "caution"] },
  { name: "info-circle", keywords: ["info", "details", "help"] },
  { name: "check", keywords: ["success", "done", "complete"] },
  { name: "checks", keywords: ["verified", "double check", "confirmed"] },

  // Categories & Shapes
  { name: "category", keywords: ["group", "type", "category"] },
  { name: "category-2", keywords: ["group", "type", "category"] },
  { name: "category-plus", keywords: ["new category", "add group", "type"] },
  { name: "circle", keywords: ["shape", "circle", "round"] },
  { name: "circle-dot", keywords: ["radio", "select", "dot"] },
  { name: "triangle", keywords: ["shape", "triangle", "delta"] },

  // Misc Utility
  { name: "bell", keywords: ["notification", "alert", "reminder"] },
  { name: "star", keywords: ["favorite", "rating", "special"] },
  { name: "calendar", keywords: ["date", "schedule", "event"] },
  { name: "calendar-event", keywords: ["appointment", "meeting", "event"] },
  { name: "calendar-repeat", keywords: ["recurring", "schedule", "repeat"] },
  { name: "calendar-week", keywords: ["weekly", "week", "schedule"] },
  { name: "calendar-month", keywords: ["monthly", "month", "schedule"] },
  { name: "clock", keywords: ["time", "hour", "schedule"] },
  { name: "clock-bolt", keywords: ["fast", "time", "quick"] },
  { name: "clock-hour-4", keywords: ["time", "deadline", "schedule"] },
  { name: "anchor", keywords: ["maritime", "stable", "fixed"] },
  { name: "archive", keywords: ["store", "save", "backup"] },
  { name: "target", keywords: ["goal", "aim", "objective"] },
  { name: "filter", keywords: ["sort", "search", "refine"] },
  { name: "search", keywords: ["find", "look", "query"] },
  { name: "external-link", keywords: ["open", "link", "navigate"] },
  { name: "repeat", keywords: ["recurring", "cycle", "loop"] },
  { name: "hash", keywords: ["number", "tag", "social"] },
  { name: "affiliate", keywords: ["referral", "partner", "network"] },
  { name: "adjustments", keywords: ["settings", "tune", "configure"] },
  { name: "scale", keywords: ["balance", "justice", "weight"] },
  { name: "trash", keywords: ["delete", "remove", "bin"] },
  { name: "list-details", keywords: ["list", "details", "items"] },
  { name: "home-share", keywords: ["home", "share", "property"] },
  { name: "copy", keywords: ["duplicate", "clone", "copy"] },
  { name: "transfer", keywords: ["transfer", "move", "send"] },

  // Navigation / Location
  { name: "current-location", keywords: ["gps", "here", "location"] },
  { name: "world-pin", keywords: ["global", "world", "location"] },

  // Social & Brands
  { name: "brand-paypal", keywords: ["paypal", "payment", "online"] },
  { name: "brand-stripe", keywords: ["stripe", "payment", "online"] },
  { name: "brand-whatsapp", keywords: ["whatsapp", "chat", "messaging"] },
  { name: "brand-facebook", keywords: ["facebook", "social", "meta"] },
  { name: "brand-instagram", keywords: ["instagram", "social", "photo"] },
  { name: "brand-twitter", keywords: ["twitter", "social", "x"] },
  { name: "brand-youtube", keywords: ["youtube", "video", "streaming"] },
  { name: "brand-spotify", keywords: ["spotify", "music", "streaming"] },
  { name: "brand-linkedin", keywords: ["linkedin", "work", "professional"] },
  { name: "brand-google", keywords: ["google", "search", "tech"] },
  { name: "brand-apple", keywords: ["apple", "ios", "tech"] },

  // Food & Drink
  { name: "coffee", keywords: ["coffee", "cafe", "drink"] },
  { name: "flask", keywords: ["science", "lab", "research", "chemistry"] },
  { name: "droplet", keywords: ["water", "liquid", "hydration", "utilities"] },
  { name: "beer", keywords: ["beer", "alcohol", "bar"] },
  { name: "bowl", keywords: ["food", "meal", "dining"] },
  { name: "bowl-spoon", keywords: ["soup", "cereal", "breakfast"] },
  { name: "bowl-chopsticks", keywords: ["asian", "noodles", "dining"] },
  { name: "bread", keywords: ["bakery", "food", "grocery"] },
  { name: "mug", keywords: ["coffee", "tea", "drink"] },
  { name: "milk", keywords: ["dairy", "drink", "grocery"] },
  { name: "egg", keywords: ["food", "breakfast", "grocery"] },
  { name: "egg-fried", keywords: ["breakfast", "cooking", "food"] },
  { name: "salad", keywords: ["healthy", "food", "vegetables"] },
  { name: "soup", keywords: ["food", "meal", "cooking"] },
  { name: "chef-hat", keywords: ["cooking", "restaurant", "kitchen"] },
  { name: "tools-kitchen-2", keywords: ["cooking", "kitchen", "utensils"] },
  { name: "dumpling", keywords: ["asian", "food", "dining"] },
  { name: "bottle", keywords: ["drink", "water", "beverage"] },
  { name: "cookie", keywords: ["snack", "dessert", "food"] },
  { name: "cherry", keywords: ["fruit", "food", "grocery"] },
  { name: "apple", keywords: ["fruit", "food", "grocery"] },
  { name: "melon", keywords: ["fruit", "food", "summer"] },
  { name: "glass", keywords: ["drink", "bar", "beverage"] },
  { name: "glass-full", keywords: ["drink", "full", "beverage"] },

  // Health & Medical
  { name: "pill", keywords: ["medicine", "health", "pharmacy"] },
  { name: "medical-cross", keywords: ["health", "medical", "emergency"] },
  { name: "bandage", keywords: ["injury", "first aid", "health"] },
  { name: "face-mask", keywords: ["health", "protection", "covid"] },
  { name: "nurse", keywords: ["healthcare", "hospital", "medical"] },
  { name: "lungs", keywords: ["health", "breathing", "medical"] },
  { name: "hospital-circle", keywords: ["hospital", "health", "medical"] },
  { name: "microscope", keywords: ["science", "lab", "research"] },
  { name: "device-watch", keywords: ["smartwatch", "fitness", "health"] },

  // Home & Living
  { name: "bed", keywords: ["sleep", "bedroom", "home"] },
  { name: "bath", keywords: ["bathroom", "hygiene", "home"] },
  { name: "home", keywords: ["house", "home", "property"] },
  { name: "home-2", keywords: ["house", "home", "property"] },
  { name: "flower", keywords: ["nature", "garden", "decoration"] },
  { name: "leaf", keywords: ["nature", "plant", "eco"] },
  { name: "seedling", keywords: ["plant", "growth", "garden"] },
  { name: "candle", keywords: ["light", "relaxation", "home"] },
  { name: "blender", keywords: ["kitchen", "cooking", "appliance"] },
  { name: "microwave", keywords: ["kitchen", "appliance", "cooking"] },
  { name: "garden-cart", keywords: ["garden", "outdoor", "home"] },
  { name: "elevator", keywords: ["building", "floors", "lift"] },

  // Travel & Transport
  { name: "plane", keywords: ["flight", "travel", "airline"] },
  { name: "plane-arrival", keywords: ["arrival", "flight", "airport"] },
  { name: "plane-departure", keywords: ["departure", "flight", "airport"] },
  { name: "bus", keywords: ["public transit", "transport", "commute"] },
  { name: "train", keywords: ["rail", "transit", "commute"] },
  { name: "truck", keywords: ["delivery", "freight", "transport"] },
  { name: "ferry", keywords: ["boat", "water", "travel"] },
  { name: "motorbike", keywords: ["motorcycle", "transport", "vehicle"] },
  { name: "bike", keywords: ["bicycle", "cycling", "transport"] },
  { name: "compass", keywords: ["navigation", "direction", "travel"] },
  { name: "gas-station", keywords: ["fuel", "petrol", "car"] },
  { name: "steering-wheel", keywords: ["driving", "car", "vehicle"] },
  { name: "caravan", keywords: ["camping", "road trip", "travel"] },
  { name: "car-suv", keywords: ["suv", "vehicle", "car"] },
  { name: "speedboat", keywords: ["boat", "water", "leisure"] },

  // Entertainment & Leisure
  {
    name: "binoculars",
    keywords: ["travel", "exploration", "sightseeing", "tourism"],
  },
  { name: "dice", keywords: ["gaming", "board games", "chance", "fun"] },
  { name: "wand", keywords: ["magic", "creative", "special", "entertainment"] },
  { name: "headset", keywords: ["gaming", "audio", "entertainment"] },
  { name: "ticket", keywords: ["event", "cinema", "entertainment"] },
  { name: "trophy", keywords: ["achievement", "winner", "prize"] },
  { name: "award", keywords: ["achievement", "recognition", "prize"] },
  { name: "golf", keywords: ["sport", "golf", "leisure"] },
  { name: "barbell", keywords: ["gym", "fitness", "workout"] },
  { name: "sparkles", keywords: ["magic", "special", "celebration"] },
  { name: "microphone", keywords: ["music", "podcast", "recording"] },
  { name: "player-play", keywords: ["play", "media", "music"] },
  { name: "playlist", keywords: ["music", "queue", "media"] },
  { name: "device-tv", keywords: ["tv", "television", "entertainment"] },
  { name: "device-gamepad", keywords: ["gaming", "console", "entertainment"] },
  { name: "ball-bowling", keywords: ["bowling", "sport", "recreation"] },

  // Finance extras
  { name: "receipt-dollar", keywords: ["bill", "usd", "payment"] },
  { name: "receipt-euro", keywords: ["bill", "euro", "payment"] },
  { name: "receipt-pound", keywords: ["bill", "gbp", "payment"] },
  { name: "receipt-rupee", keywords: ["bill", "inr", "payment"] },
  { name: "receipt-yen", keywords: ["bill", "jpy", "payment"] },
  { name: "report-money", keywords: ["finance", "report", "earnings"] },
  { name: "report-analytics", keywords: ["analytics", "report", "data"] },
  { name: "discount", keywords: ["sale", "offer", "coupon"] },
  { name: "rosette-discount", keywords: ["deal", "promo", "discount"] },
  {
    name: "rosette-discount-check",
    keywords: ["verified deal", "promo", "discount"],
  },
  { name: "zoom-money", keywords: ["finance", "analysis", "money"] },
  { name: "coin-bitcoin", keywords: ["bitcoin", "crypto", "btc"] },
  { name: "coin-euro", keywords: ["euro", "eur", "currency"] },
  { name: "coin-rupee", keywords: ["rupee", "inr", "currency"] },
  { name: "coin-yen", keywords: ["yen", "jpy", "currency"] },
  { name: "coin-yuan", keywords: ["yuan", "cny", "currency"] },
  { name: "coin", keywords: ["money", "coin", "cash"] },
  { name: "coins", keywords: ["money", "coins", "cashback", "allowance"] },
  { name: "file-invoice", keywords: ["invoice", "bill", "document"] },
  { name: "file-dollar", keywords: ["finance", "document", "money"] },
  { name: "exchange", keywords: ["swap", "transfer", "convert"] },

  // Communication
  { name: "phone", keywords: ["call", "mobile", "contact"] },
  { name: "phone-call", keywords: ["calling", "contact", "dial"] },
  { name: "mail", keywords: ["email", "letter", "inbox"] },
  { name: "mail-opened", keywords: ["email", "read", "inbox"] },
  { name: "message", keywords: ["chat", "sms", "text"] },
  { name: "message-2", keywords: ["chat", "bubble", "text"] },
  { name: "message-circle", keywords: ["chat", "bubble", "text"] },
  { name: "send", keywords: ["send", "submit", "share"] },

  // Work & Education
  { name: "book", keywords: ["reading", "education", "study"] },
  { name: "bookmark", keywords: ["save", "favorite", "reading"] },
  { name: "bookmarks", keywords: ["saved", "collection", "reading"] },
  { name: "flag", keywords: ["goal", "milestone", "mark"] },
  { name: "flag-2", keywords: ["goal", "landmark", "mark"] },
  { name: "dashboard", keywords: ["overview", "stats", "summary"] },
  { name: "crown", keywords: ["premium", "vip", "special"] },
  { name: "id", keywords: ["identity", "badge", "card"] },
  { name: "writing", keywords: ["write", "notes", "journal"] },
  { name: "keyboard", keywords: ["typing", "computer", "input"] },
  { name: "briefcase-2", keywords: ["work", "business", "career"] },
  { name: "library", keywords: ["books", "education", "knowledge"] },

  // Clothing & Fashion
  { name: "paint", keywords: ["art", "creativity", "hobbies", "design"] },
  { name: "shirt", keywords: ["clothing", "fashion", "apparel"] },
  { name: "hanger-2", keywords: ["clothing", "wardrobe", "fashion"] },
  { name: "sunglasses", keywords: ["fashion", "summer", "style"] },
  { name: "umbrella", keywords: ["rain", "weather", "protection"] },
  { name: "diamond", keywords: ["luxury", "jewelry", "premium"] },

  // Nature & Weather
  { name: "snowflake", keywords: ["winter", "cold", "snow", "weather"] },
  { name: "plant", keywords: ["garden", "home", "eco", "green"] },
  { name: "sun", keywords: ["sunny", "weather", "day"] },
  { name: "moon", keywords: ["night", "sleep", "weather"] },
  { name: "mountain", keywords: ["hiking", "outdoors", "nature"] },
  { name: "flame", keywords: ["fire", "energy", "heat"] },
  { name: "cloud", keywords: ["weather", "cloudy", "sky"] },
  { name: "sunrise", keywords: ["morning", "dawn", "day"] },
  { name: "sunset", keywords: ["evening", "dusk", "sky"] },
  { name: "campfire", keywords: ["camping", "outdoors", "fire"] },
  { name: "bolt", keywords: ["electricity", "energy", "power"] },
  { name: "mushroom", keywords: ["food", "nature", "foraging"] },

  // Security & Identity
  { name: "key", keywords: ["access", "password", "unlock"] },
  { name: "shield-check", keywords: ["secure", "verified", "protected"] },
  { name: "shield-lock", keywords: ["locked", "secure", "vault"] },
  { name: "shield", keywords: ["protection", "security", "defense"] },

  // People & Family
  {
    name: "mood-happy",
    keywords: ["wellness", "happiness", "mental health", "mood"],
  },
  { name: "baby-carriage", keywords: ["baby", "family", "infant"] },
  { name: "man", keywords: ["person", "male", "profile"] },
  { name: "woman", keywords: ["person", "female", "profile"] },
  { name: "paw", keywords: ["pet", "animal", "dog"] },
  { name: "paw-print", keywords: ["pet", "animal", "cat", "dog"] },
  { name: "lifebuoy", keywords: ["help", "support", "rescue"] },
  { name: "thumb-up", keywords: ["like", "approve", "positive"] },
  { name: "thumb-down", keywords: ["dislike", "negative", "reject"] },

  // Tech & Devices
  { name: "download", keywords: ["save", "download", "import"] },
  { name: "link", keywords: ["url", "web", "connect"] },
  { name: "globe", keywords: ["internet", "web", "global"] },
  { name: "world", keywords: ["global", "international", "earth"] },
  { name: "satellite", keywords: ["satellite", "signal", "tech"] },
  { name: "cloud-computing", keywords: ["cloud", "server", "tech"] },
  { name: "device-tablet", keywords: ["tablet", "ipad", "device"] },
  { name: "device-speaker", keywords: ["speaker", "audio", "sound"] },

  // Analytics extras
  { name: "analyze", keywords: ["analysis", "data", "insights"] },
  { name: "graph", keywords: ["chart", "stats", "data"] },
  { name: "chart-candle", keywords: ["trading", "stocks", "finance"] },
  { name: "chart-funnel", keywords: ["funnel", "pipeline", "analytics"] },
  { name: "chart-area", keywords: ["area chart", "trend", "analytics"] },
  {
    name: "chart-donut",
    keywords: ["donut chart", "distribution", "analytics"],
  },
  { name: "presentation-analytics", keywords: ["report", "slides", "data"] },

  // Time & Alerts
  { name: "hourglass", keywords: ["time", "waiting", "timer"] },
  { name: "alarm", keywords: ["alarm", "reminder", "wake"] },
  { name: "bell-ringing", keywords: ["notification", "alert", "ringing"] },

  // Shopping & Celebration
  {
    name: "christmas-tree",
    keywords: ["holiday", "christmas", "gifts", "seasonal"],
  },
  { name: "trolley", keywords: ["shopping", "cart", "supermarket"] },
  { name: "gift-card", keywords: ["voucher", "gift", "card"] },
  { name: "rosette", keywords: ["badge", "achievement", "award"] },
  { name: "confetti", keywords: ["celebration", "party", "event"] },
  { name: "balloon", keywords: ["party", "celebration", "birthday"] },
  { name: "pennant", keywords: ["flag", "sport", "team"] },

  // Misc
  { name: "quote", keywords: ["quote", "text", "speech"] },
  { name: "table", keywords: ["data", "grid", "spreadsheet"] },
  { name: "stack", keywords: ["layers", "items", "collection"] },
  { name: "timeline-event", keywords: ["event", "history", "timeline"] },
  { name: "bulb", keywords: ["idea", "light", "innovation"] },
  { name: "pin", keywords: ["location", "mark", "pin"] },
  { name: "navigation", keywords: ["navigate", "direction", "gps"] },
  { name: "file-text", keywords: ["document", "notes", "text"] },
]

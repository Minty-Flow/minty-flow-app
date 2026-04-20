import type { FC } from "react"
import type { OpaqueColorValue, StyleProp, ViewStyle } from "react-native"
import type { SvgProps } from "react-native-svg"
import { useUnistyles } from "react-native-unistyles"

import * as FilledIcons from "~/components/icons/filled"
import * as OutlineIcons from "~/components/icons/outline"
import { logger } from "~/utils/logger"

const ICON_MAP = {
  // UI & Navigation
  "arrow-down-left": OutlineIcons.ArrowDownLeft,
  "arrow-narrow-left": OutlineIcons.ArrowNarrowLeft,
  "arrow-narrow-right": OutlineIcons.ArrowNarrowRight,
  "arrow-up-right": OutlineIcons.ArrowUpRight,
  "arrow-narrow-up": OutlineIcons.ArrowNarrowUp,
  "arrow-narrow-down": OutlineIcons.ArrowNarrowDown,
  "arrow-down": OutlineIcons.ArrowDown,
  "arrow-up": OutlineIcons.ArrowUp,
  "arrow-up-circle": FilledIcons.ArrowUpCircle,
  "arrow-down-circle": FilledIcons.ArrowDownCircle,
  "chevron-down": FilledIcons.ChevronDown,
  "chevron-up": OutlineIcons.ChevronUp,
  "chevron-left": OutlineIcons.ChevronLeft,
  "chevron-right": FilledIcons.ChevronRight,
  "chevrons-down": OutlineIcons.ChevronsDown,
  "chevrons-up": OutlineIcons.ChevronsUp,
  transfer: OutlineIcons.Transfer,
  x: FilledIcons.X,
  search: OutlineIcons.Search,
  "arrows-up-down": OutlineIcons.ArrowsUpDown,
  "arrows-left-right": OutlineIcons.ArrowsLeftRight,
  eye: FilledIcons.Eye,
  "eye-off": OutlineIcons.EyeOff,

  // Status & Alerts
  "alert-triangle": FilledIcons.AlertTriangle,
  "alert-circle": FilledIcons.AlertCircle,
  check: FilledIcons.Check,
  checks: OutlineIcons.Checks,
  "info-circle": FilledIcons.InfoCircle,
  "shield-exclamation": OutlineIcons.ShieldExclamation,

  // Shapes & Layout
  circle: FilledIcons.Circle,
  "circle-dot": FilledIcons.CircleDot,
  square: OutlineIcons.Square,
  "square-check": OutlineIcons.SquareCheck,
  category: OutlineIcons.Category,
  "category-2": OutlineIcons.Category2,
  "category-plus": OutlineIcons.CategoryPlus,
  triangle: FilledIcons.Triangle,
  "chart-bar": OutlineIcons.ChartBar,
  "chart-area-line": FilledIcons.ChartAreaLine,
  "chart-pie": FilledIcons.ChartPie,
  "chart-dots": FilledIcons.ChartDots,
  "chart-histogram": OutlineIcons.ChartHistogram,
  "page-break": OutlineIcons.PageBreak,
  "list-details": FilledIcons.ListDetails,

  // Food & Drink
  pizza: FilledIcons.Pizza,
  headphones: FilledIcons.Headphones,
  coffee: OutlineIcons.Coffee,
  flask: FilledIcons.Flask,
  droplet: FilledIcons.Droplet,

  // Media & Visual
  camera: FilledIcons.Camera,
  photo: FilledIcons.Photo,
  "library-photo": OutlineIcons.LibraryPhoto,

  // File types
  file: FilledIcons.File,
  "file-x": OutlineIcons.FileX,
  files: FilledIcons.Files,
  "file-description": FilledIcons.FileDescription,
  "file-type-jpg": OutlineIcons.FileTypeJpg,
  video: FilledIcons.Video,
  "file-analytics": FilledIcons.FileAnalytics,
  presentation: FilledIcons.Presentation,
  palette: FilledIcons.Palette,
  "color-swatch": OutlineIcons.ColorSwatch,
  "file-zip": OutlineIcons.FileZip,
  "file-type-pdf": OutlineIcons.FileTypePdf,
  "file-type-csv": OutlineIcons.FileTypeCsv,

  // Text & Editing
  clipboard: FilledIcons.Clipboard,
  pencil: FilledIcons.Pencil,
  eraser: OutlineIcons.Eraser,
  puzzle: FilledIcons.Puzzle,
  paperclip: OutlineIcons.Paperclip,
  language: OutlineIcons.Language,

  // Math & Calculator
  calculator: FilledIcons.Calculator,
  plus: FilledIcons.Plus,
  minus: OutlineIcons.Minus,
  percentage: OutlineIcons.Percentage,
  divide: OutlineIcons.Divide,
  equal: OutlineIcons.Equal,
  "plus-minus": OutlineIcons.PlusMinus,
  "circle-plus": FilledIcons.CirclePlus,

  // Finance & Commerce
  briefcase: FilledIcons.Briefcase,
  wallet: OutlineIcons.Wallet,
  "credit-card": FilledIcons.CreditCard,
  "currency-dollar": OutlineIcons.CurrencyDollar,
  currency: OutlineIcons.Currency,
  "cash-banknote": FilledIcons.CashBanknote,
  "pig-money": OutlineIcons.PigMoney,
  pig: FilledIcons.Pig,
  tag: FilledIcons.Tag,
  tags: FilledIcons.Tags,
  "tag-plus": OutlineIcons.TagPlus,
  "coin-pound": FilledIcons.CoinPound,
  "shopping-cart": FilledIcons.ShoppingCart,
  gift: FilledIcons.Gift,
  basket: FilledIcons.Basket,
  "cash-banknote-plus": OutlineIcons.CashBanknotePlus,
  "building-bank": OutlineIcons.BuildingBank,

  // Devices & System
  plug: OutlineIcons.Plug,
  database: OutlineIcons.Database,
  "database-export": OutlineIcons.DatabaseExport,
  "database-import": OutlineIcons.DatabaseImport,
  dialpad: FilledIcons.Dialpad,
  "device-desktop": FilledIcons.DeviceDesktop,
  settings: FilledIcons.Settings,
  "device-mobile-vibration": OutlineIcons.DeviceMobileVibration,
  "device-mobile-off": OutlineIcons.DeviceMobileOff,
  "device-mobile": FilledIcons.DeviceMobile,
  refresh: OutlineIcons.Refresh,
  restore: OutlineIcons.Restore,

  // Security
  lock: FilledIcons.Lock,
  "lock-open": OutlineIcons.LockOpen,
  fingerprint: OutlineIcons.Fingerprint,
  "password-mobile-phone": OutlineIcons.PasswordMobilePhone,

  // People & Social
  "heart-handshake": OutlineIcons.HeartHandshake,
  heart: FilledIcons.Heart,
  activity: OutlineIcons.Activity,
  "device-heart-monitor": FilledIcons.DeviceHeartMonitor,
  user: FilledIcons.User,
  "user-plus": OutlineIcons.UserPlus,
  "user-question": OutlineIcons.UserQuestion,
  users: OutlineIcons.Users,

  // Places
  "map-pin": FilledIcons.MapPin,
  "world-pin": OutlineIcons.WorldPin,
  "current-location": FilledIcons.CurrentLocation,
  building: OutlineIcons.Building,
  "building-bridge-2": FilledIcons.BuildingBridge2,
  school: FilledIcons.School,
  car: FilledIcons.Car,
  map: OutlineIcons.Map,
  "world-map": OutlineIcons.WorldMap,

  // Misc
  backspace: FilledIcons.Backspace,
  bell: FilledIcons.Bell,
  trash: FilledIcons.Trash,
  target: OutlineIcons.Target,
  clock: FilledIcons.Clock,
  "clock-bolt": OutlineIcons.ClockBolt,
  calendar: FilledIcons.Calendar,
  "calendar-repeat": OutlineIcons.CalendarRepeat,
  "calendar-event": FilledIcons.CalendarEvent,
  "calendar-week": FilledIcons.CalendarWeek,
  "calendar-month": FilledIcons.CalendarMonth,
  "clock-hour-4": FilledIcons.ClockHour4,
  anchor: OutlineIcons.Anchor,
  archive: FilledIcons.Archive,
  "archive-off": OutlineIcons.ArchiveOff,
  star: FilledIcons.Star,
  "trending-up": OutlineIcons.TrendingUp,
  "trending-down": OutlineIcons.TrendingDown,
  filter: FilledIcons.Filter,
  "filter-off": OutlineIcons.FilterOff,
  "external-link": FilledIcons.ExternalLink,
  asterisk: OutlineIcons.Asterisk,
  "square-asterisk": FilledIcons.SquareAsterisk,
  adjustments: FilledIcons.Adjustments,
  circles: FilledIcons.Circles,
  "trash-off": OutlineIcons.TrashOff,
  repeat: OutlineIcons.Repeat,
  "playlist-x": OutlineIcons.PlaylistX,
  affiliate: OutlineIcons.Affiliate,
  hash: OutlineIcons.Hash,
  "grip-horizontal": OutlineIcons.GripHorizontal,
  "question-mark": OutlineIcons.QuestionMark,
  "arrow-move-vertical": OutlineIcons.ArrowsMoveVertical,
  "alert-square-rounded": OutlineIcons.AlertSquareRounded,
  "address-book": OutlineIcons.AddressBook,
  "switch-horizontal": OutlineIcons.SwitchHorizontal,
  "arrows-diff": OutlineIcons.ArrowsDiff,
  "home-share": OutlineIcons.HomeShare,
  scale: OutlineIcons.Scale,
  "caret-down": FilledIcons.CaretDown,
  "caret-up": FilledIcons.CaretUp,
  //TODO: this clock progress like
  "history-toggle": OutlineIcons.HistoryToggle,
  copy: FilledIcons.Copy,
  receipt: OutlineIcons.Receipt,

  // Social & Brands
  "brand-paypal": FilledIcons.BrandPaypal,
  "brand-stripe": FilledIcons.BrandStripe,
  "brand-whatsapp": FilledIcons.BrandWhatsapp,
  "brand-facebook": FilledIcons.BrandFacebook,
  "brand-instagram": FilledIcons.BrandInstagram,
  "brand-twitter": FilledIcons.BrandTwitter,
  "brand-youtube": FilledIcons.BrandYoutube,
  "brand-spotify": FilledIcons.BrandSpotify,
  "brand-linkedin": FilledIcons.BrandLinkedin,
  "brand-google": FilledIcons.BrandGoogle,
  "brand-apple": FilledIcons.BrandApple,

  // Food & Drink
  beer: FilledIcons.Beer,
  bowl: FilledIcons.Bowl,
  "bowl-spoon": FilledIcons.BowlSpoon,
  "bowl-chopsticks": FilledIcons.BowlChopsticks,
  bread: FilledIcons.Bread,
  mug: FilledIcons.Mug,
  milk: FilledIcons.Milk,
  egg: FilledIcons.Egg,
  "egg-fried": FilledIcons.EggFried,
  salad: FilledIcons.Salad,
  soup: FilledIcons.Soup,
  "chef-hat": FilledIcons.ChefHat,
  "tools-kitchen-2": FilledIcons.ToolsKitchen2,
  dumpling: FilledIcons.Dumpling,
  bottle: FilledIcons.Bottle,
  cookie: FilledIcons.Cookie,
  cherry: FilledIcons.Cherry,
  apple: FilledIcons.Apple,
  melon: FilledIcons.Melon,
  glass: FilledIcons.Glass,
  "glass-full": FilledIcons.GlassFull,

  // Health & Medical
  pill: FilledIcons.Pill,
  "medical-cross": FilledIcons.MedicalCross,
  bandage: FilledIcons.Bandage,
  "face-mask": FilledIcons.FaceMask,
  nurse: FilledIcons.Nurse,
  lungs: FilledIcons.Lungs,
  "hospital-circle": FilledIcons.HospitalCircle,
  microscope: FilledIcons.Microscope,
  "device-watch": FilledIcons.DeviceWatch,

  // Home & Living
  bed: FilledIcons.Bed,
  "bed-flat": FilledIcons.BedFlat,
  bath: FilledIcons.Bath,
  home: FilledIcons.Home,
  "home-2": FilledIcons.Home2,
  flower: FilledIcons.Flower,
  leaf: FilledIcons.Leaf,
  seedling: FilledIcons.Seedling,
  candle: FilledIcons.Candle,
  blender: FilledIcons.Blender,
  microwave: FilledIcons.Microwave,
  "garden-cart": FilledIcons.GardenCart,
  elevator: FilledIcons.Elevator,

  // Travel & Transport
  plane: FilledIcons.Plane,
  "plane-arrival": FilledIcons.PlaneArrival,
  "plane-departure": FilledIcons.PlaneDeparture,
  bus: FilledIcons.Bus,
  train: FilledIcons.Train,
  truck: FilledIcons.Truck,
  ferry: FilledIcons.Ferry,
  motorbike: FilledIcons.Motorbike,
  bike: FilledIcons.Bike,
  compass: FilledIcons.Compass,
  "gas-station": FilledIcons.GasStation,
  "steering-wheel": FilledIcons.SteeringWheel,
  caravan: FilledIcons.Caravan,
  "car-suv": FilledIcons.CarSuv,
  "car-4wd": FilledIcons.Car4Wd,
  speedboat: FilledIcons.Speedboat,

  // Entertainment & Leisure
  binoculars: FilledIcons.Binoculars,
  dice: OutlineIcons.Dice,
  wand: OutlineIcons.Wand,
  headset: FilledIcons.Headset,
  ticket: FilledIcons.Ticket,
  trophy: FilledIcons.Trophy,
  award: FilledIcons.Award,
  golf: FilledIcons.Golf,
  barbell: FilledIcons.Barbell,
  sparkles: FilledIcons.Sparkles,
  "sparkles-2": FilledIcons.Sparkles2,
  microphone: FilledIcons.Microphone,
  "player-play": FilledIcons.PlayerPlay,
  "player-pause": FilledIcons.PlayerPause,
  playlist: FilledIcons.Playlist,
  "device-tv": FilledIcons.DeviceTv,
  "device-gamepad": FilledIcons.DeviceGamepad,
  "ball-bowling": FilledIcons.BallBowling,

  // Finance extras
  "receipt-dollar": FilledIcons.ReceiptDollar,
  "receipt-euro": FilledIcons.ReceiptEuro,
  "receipt-pound": FilledIcons.ReceiptPound,
  "receipt-rupee": FilledIcons.ReceiptRupee,
  "receipt-yen": FilledIcons.ReceiptYen,
  "receipt-yuan": FilledIcons.ReceiptYuan,
  "report-money": FilledIcons.ReportMoney,
  "report-analytics": FilledIcons.ReportAnalytics,
  discount: FilledIcons.Discount,
  "rosette-discount": FilledIcons.RosetteDiscount,
  "rosette-discount-check": FilledIcons.RosetteDiscountCheck,
  "zoom-money": FilledIcons.ZoomMoney,
  "coin-bitcoin": FilledIcons.CoinBitcoin,
  "coin-euro": FilledIcons.CoinEuro,
  "coin-rupee": FilledIcons.CoinRupee,
  "coin-yen": FilledIcons.CoinYen,
  "coin-yuan": FilledIcons.CoinYuan,
  coin: FilledIcons.Coin,
  coins: OutlineIcons.Coins,
  "file-invoice": FilledIcons.FileInvoice,
  "file-dollar": FilledIcons.FileDollar,
  exchange: FilledIcons.Exchange,

  // Communication
  phone: FilledIcons.Phone,
  "phone-call": FilledIcons.PhoneCall,
  mail: FilledIcons.Mail,
  "mail-opened": FilledIcons.MailOpened,
  message: FilledIcons.Message,
  "message-2": FilledIcons.Message2,
  "message-circle": FilledIcons.MessageCircle,
  "message-report": FilledIcons.MessageReport,
  "message-chatbot": FilledIcons.MessageChatbot,
  send: FilledIcons.Send,
  messages: FilledIcons.Messages,

  // Work & Education
  book: FilledIcons.Book,
  bookmark: FilledIcons.Bookmark,
  bookmarks: FilledIcons.Bookmarks,
  flag: FilledIcons.Flag,
  "flag-2": FilledIcons.Flag2,
  dashboard: FilledIcons.Dashboard,
  crown: FilledIcons.Crown,
  id: FilledIcons.Id,
  writing: FilledIcons.Writing,
  "writing-sign": FilledIcons.WritingSign,
  keyboard: FilledIcons.Keyboard,
  "briefcase-2": FilledIcons.Briefcase2,
  library: FilledIcons.Library,
  "library-plus": FilledIcons.LibraryPlus,

  // Clothing & Fashion
  paint: FilledIcons.Paint,
  shirt: FilledIcons.Shirt,
  "hanger-2": FilledIcons.Hanger2,
  sunglasses: FilledIcons.Sunglasses,
  umbrella: FilledIcons.Umbrella,
  diamond: FilledIcons.Diamond,

  // Nature & Weather
  snowflake: OutlineIcons.Snowflake,
  plant: OutlineIcons.Plant,
  sun: FilledIcons.Sun,
  moon: FilledIcons.Moon,
  mountain: FilledIcons.Mountain,
  flame: FilledIcons.Flame,
  cloud: FilledIcons.Cloud,
  sunrise: FilledIcons.Sunrise,
  sunset: FilledIcons.Sunset,
  campfire: FilledIcons.Campfire,
  cactus: FilledIcons.Cactus,
  bolt: FilledIcons.Bolt,
  mushroom: FilledIcons.Mushroom,

  // Security & Identity
  key: FilledIcons.Key,
  "shield-check": FilledIcons.ShieldCheck,
  "shield-lock": FilledIcons.ShieldLock,
  shield: FilledIcons.Shield,
  "shield-checkered": OutlineIcons.ShieldCheckered,

  // People & Family
  "mood-happy": FilledIcons.MoodHappy,
  "baby-carriage": FilledIcons.BabyCarriage,
  man: FilledIcons.Man,
  woman: FilledIcons.Woman,
  paw: FilledIcons.Paw,
  "paw-print": OutlineIcons.Paw,
  lifebuoy: FilledIcons.Lifebuoy,
  "thumb-up": FilledIcons.ThumbUp,
  "thumb-down": FilledIcons.ThumbDown,

  // Tech & Devices extras
  download: FilledIcons.Download,
  link: FilledIcons.Link,
  globe: FilledIcons.Globe,
  world: FilledIcons.World,
  satellite: FilledIcons.Satellite,
  "cloud-computing": FilledIcons.CloudComputing,
  "device-tablet": FilledIcons.DeviceTablet,
  "device-speaker": FilledIcons.DeviceSpeaker,

  // Analytics extras
  analyze: FilledIcons.Analyze,
  graph: FilledIcons.Graph,
  "chart-candle": FilledIcons.ChartCandle,
  "chart-funnel": FilledIcons.ChartFunnel,
  "chart-area": FilledIcons.ChartArea,
  "chart-donut": FilledIcons.ChartDonut,
  "chart-bubble": FilledIcons.ChartBubble,
  "presentation-analytics": FilledIcons.PresentationAnalytics,

  // Time & Alerts extras
  hourglass: FilledIcons.Hourglass,
  alarm: FilledIcons.Alarm,
  "alarm-plus": FilledIcons.AlarmPlus,
  "alarm-minus": FilledIcons.AlarmMinus,
  "bell-ringing": FilledIcons.BellRinging,
  "bell-plus": FilledIcons.BellPlus,
  "bell-minus": FilledIcons.BellMinus,
  "bell-x": FilledIcons.BellX,

  // Location & Navigation extras
  pin: FilledIcons.Pin,
  pinned: FilledIcons.Pinned,
  navigation: FilledIcons.Navigation,

  // Shopping & Celebration
  "christmas-tree": FilledIcons.ChristmasTree,
  trolley: FilledIcons.Trolley,
  "gift-card": FilledIcons.GiftCard,
  rosette: FilledIcons.Rosette,
  confetti: FilledIcons.Confetti,
  balloon: FilledIcons.Balloon,
  pennant: FilledIcons.Pennant,
  "pennant-2": FilledIcons.Pennant2,

  // Misc
  quote: FilledIcons.Quote,
  table: FilledIcons.Table,
  stack: FilledIcons.Stack,
  "timeline-event": FilledIcons.TimelineEvent,
  bulb: FilledIcons.Bulb,
  "atom-2": FilledIcons.Atom2,
  magnet: FilledIcons.Magnet,
  "file-text": FilledIcons.FileText,
} as const satisfies Record<string, FC<SvgProps>>

export type IconSvgName = keyof typeof ICON_MAP

export type IconSize =
  | 12
  | 14
  | 16
  | 18
  | 20
  | 22
  | 24
  | 28
  | 32
  | 36
  | 40
  | 48
  | 56
  | 64
  | 72
  | 80
  | 88
  | 96
  | 104
  | 112
  | 120
  | 128
  | 136
  | 144
  | 152
  | 160
  | 168
  | 176
  | 184
  | 192
  | 200
  | 208
  | 216
  | 224
  | 232
  | 240
  | 248
  | 256
  | 26

type IconSymbolProps = Omit<SvgProps, "width" | "height"> & {
  name: IconSvgName
  size?: IconSize
  color?: string | OpaqueColorValue
  style?: StyleProp<ViewStyle>
}

export function IconSvg({
  name,
  size = 24,
  color,
  style,
  ...rest
}: IconSymbolProps) {
  const { theme } = useUnistyles()

  let Icon = ICON_MAP[name] ?? ICON_MAP["question-mark"]

  if (!Icon) {
    if (__DEV__) logger.warn(`IconSvg: unknown icon "${name}"`)
    Icon = ICON_MAP["question-mark"]
  }

  const ResolvedIcon = Icon as FC<SvgProps>

  const resolvedColor = color || theme.colors.primary

  return (
    <ResolvedIcon
      width={size}
      height={size}
      color={resolvedColor}
      style={style as SvgProps["style"]}
      {...rest}
    />
  )
}

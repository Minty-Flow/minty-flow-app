import type { FC } from "react"
import type { OpaqueColorValue, StyleProp, ViewStyle } from "react-native"
import type { SvgProps } from "react-native-svg"
import { useUnistyles } from "react-native-unistyles"

import * as FilledIcons from "~/components/icons/filled"
import * as OutlineIcons from "~/components/icons/outline"
import { logger } from "~/utils/logger"

const ICON_MAP = {
  // UI & Navigation
  "arrow-down-left-outline": OutlineIcons.ArrowDownLeft,
  "arrow-narrow-left-outline": OutlineIcons.ArrowNarrowLeft,
  "arrow-narrow-right-outline": OutlineIcons.ArrowNarrowRight,
  "arrow-up-right-outline": OutlineIcons.ArrowUpRight,
  "arrow-narrow-up-outline": OutlineIcons.ArrowNarrowUp,
  "arrow-narrow-down-outline": OutlineIcons.ArrowNarrowDown,
  "arrow-down-outline": OutlineIcons.ArrowDown,
  "arrow-up-outline": OutlineIcons.ArrowUp,
  "arrow-up-circle": FilledIcons.ArrowUpCircle,
  "arrow-down-circle": FilledIcons.ArrowDownCircle,
  "arrows-transfer-up-down-outline": OutlineIcons.ArrowsTransferUpDown,
  "chevron-down-outline": OutlineIcons.ChevronDown,
  "chevron-up-outline": OutlineIcons.ChevronUp,
  "chevron-left-outline": OutlineIcons.ChevronLeft,
  "chevron-right-outline": OutlineIcons.ChevronRight,
  "chevrons-down-outline": OutlineIcons.ChevronsDown,
  "chevrons-up-outline": OutlineIcons.ChevronsUp,
  "transfer-outline": OutlineIcons.Transfer,
  "search-outline": OutlineIcons.Search,

  "arrows-up-down-outline": OutlineIcons.ArrowsUpDown,
  "arrows-right-left-outline": OutlineIcons.ArrowsRightLeft,

  eye: FilledIcons.Eye,
  "eye-off-outline": OutlineIcons.EyeOff,

  // Status & Alerts
  "alert-triangle": FilledIcons.AlertTriangle,
  "alert-circle": FilledIcons.AlertCircle,
  check: FilledIcons.Check,
  "checks-outline": OutlineIcons.Checks,
  "info-circle": FilledIcons.InfoCircle,
  "shield-exclamation-outline": OutlineIcons.ShieldExclamation,

  // Shapes & Layout
  circle: FilledIcons.Circle,
  "circle-dot": FilledIcons.CircleDot,
  "square-outline": OutlineIcons.Square,
  "square-check-outline": OutlineIcons.SquareCheck,
  "category-outline": OutlineIcons.Category,
  "category-2-outline": OutlineIcons.Category2,
  "category-plus-outline": OutlineIcons.CategoryPlus,
  triangle: FilledIcons.Triangle,
  "chart-bar-outline": OutlineIcons.ChartBar,
  "chart-area-line": FilledIcons.ChartAreaLine,
  "chart-pie": FilledIcons.ChartPie,
  "chart-dots": FilledIcons.ChartDots,
  "chart-histogram-outline": OutlineIcons.ChartHistogram,
  "page-break-outline": OutlineIcons.PageBreak,
  "list-details": FilledIcons.ListDetails,

  // Food & Drink
  pizza: FilledIcons.Pizza,
  headphones: FilledIcons.Headphones,
  "coffee-outline": OutlineIcons.Coffee,
  flask: FilledIcons.Flask,
  droplet: FilledIcons.Droplet,

  // Media & Visual
  camera: FilledIcons.Camera,
  photo: FilledIcons.Photo,
  "library-photo-outline": OutlineIcons.LibraryPhoto,

  // File types
  file: FilledIcons.File,
  "file-x-outline": OutlineIcons.FileX,
  files: FilledIcons.Files,
  "file-description": FilledIcons.FileDescription,
  "file-type-jpg-outline": OutlineIcons.FileTypeJpg,
  video: FilledIcons.Video,
  "file-analytics": FilledIcons.FileAnalytics,
  presentation: FilledIcons.Presentation,
  palette: FilledIcons.Palette,
  "color-swatch-outline": OutlineIcons.ColorSwatch,
  "file-zip-outline": OutlineIcons.FileZip,
  "file-type-pdf-outline": OutlineIcons.FileTypePdf,
  "file-type-csv-outline": OutlineIcons.FileTypeCsv,

  // Text & Editing
  clipboard: FilledIcons.Clipboard,
  pencil: FilledIcons.Pencil,
  "eraser-outline": OutlineIcons.Eraser,
  puzzle: FilledIcons.Puzzle,
  "paperclip-outline": OutlineIcons.Paperclip,
  "language-outline": OutlineIcons.Language,

  // Math & Calculator
  calculator: FilledIcons.Calculator,
  plus: FilledIcons.Plus,
  "minus-outline": OutlineIcons.Minus,
  "percentage-outline": OutlineIcons.Percentage,
  "divide-outline": OutlineIcons.Divide,
  "equal-outline": OutlineIcons.Equal,
  "plus-minus-outline": OutlineIcons.PlusMinus,
  "circle-plus": FilledIcons.CirclePlus,

  // Finance & Commerce
  briefcase: FilledIcons.Briefcase,
  "wallet-outline": OutlineIcons.Wallet,
  "credit-card": FilledIcons.CreditCard,
  "currency-dollar-outline": OutlineIcons.CurrencyDollar,
  "currency-outline": OutlineIcons.Currency,
  "cash-banknote": FilledIcons.CashBanknote,
  "pig-money-outline": OutlineIcons.PigMoney,
  pig: FilledIcons.Pig,
  tag: FilledIcons.Tag,
  tags: FilledIcons.Tags,
  "tag-plus-outline": OutlineIcons.TagPlus,
  "coin-pound": FilledIcons.CoinPound,
  "cart-outline": OutlineIcons.ShoppingCart,
  "shopping-cart": FilledIcons.ShoppingCart,
  gift: FilledIcons.Gift,
  basket: FilledIcons.Basket,
  "cash-banknote-plus-outline": OutlineIcons.CashBanknotePlus,
  "building-bank-outline": OutlineIcons.BuildingBank,

  // Devices & System
  "plug-outline": OutlineIcons.Plug,
  "database-outline": OutlineIcons.Database,
  database: FilledIcons.Database,
  "database-export-outline": OutlineIcons.DatabaseExport,
  "database-import-outline": OutlineIcons.DatabaseImport,
  dialpad: FilledIcons.Dialpad,
  "device-desktop": FilledIcons.DeviceDesktop,
  settings: FilledIcons.Settings,
  "device-mobile-vibration-outline": OutlineIcons.DeviceMobileVibration,
  "device-mobile-off-outline": OutlineIcons.DeviceMobileOff,
  "device-mobile": FilledIcons.DeviceMobile,
  "refresh-outline": OutlineIcons.Refresh,
  "restore-outline": OutlineIcons.Restore,

  // Security
  lock: FilledIcons.Lock,
  "lock-open-outline": OutlineIcons.LockOpen,
  "fingerprint-outline": OutlineIcons.Fingerprint,
  "password-mobile-phone-outline": OutlineIcons.PasswordMobilePhone,

  // People & Social
  "heart-handshake-outline": OutlineIcons.HeartHandshake,
  heart: FilledIcons.Heart,
  "activity-outline": OutlineIcons.Activity,
  "device-heart-monitor": FilledIcons.DeviceHeartMonitor,
  user: FilledIcons.User,
  "user-outline": OutlineIcons.User,
  "user-plus-outline": OutlineIcons.UserPlus,
  "user-question-outline": OutlineIcons.UserQuestion,
  "users-outline": OutlineIcons.Users,

  // Places
  "map-pin": FilledIcons.MapPin,
  "world-pin-outline": OutlineIcons.WorldPin,
  "current-location": FilledIcons.CurrentLocation,
  "building-outline": OutlineIcons.Building,
  "building-bridge-2": FilledIcons.BuildingBridge2,
  school: FilledIcons.School,
  car: FilledIcons.Car,
  "map-outline": OutlineIcons.Map,
  "world-map-outline": OutlineIcons.WorldMap,

  // Misc
  backspace: FilledIcons.Backspace,
  bell: FilledIcons.Bell,
  trash: FilledIcons.Trash,
  "target-outline": OutlineIcons.Target,
  clock: FilledIcons.Clock,
  "clock-bolt-outline": OutlineIcons.ClockBolt,
  calendar: FilledIcons.Calendar,
  "calendar-repeat-outline": OutlineIcons.CalendarRepeat,
  "calendar-event": FilledIcons.CalendarEvent,
  "calendar-week": FilledIcons.CalendarWeek,
  "calendar-month": FilledIcons.CalendarMonth,
  "clock-hour-4": FilledIcons.ClockHour4,
  "anchor-outline": OutlineIcons.Anchor,
  archive: FilledIcons.Archive,
  "archive-off-outline": OutlineIcons.ArchiveOff,
  star: FilledIcons.Star,
  "trending-up-outline": OutlineIcons.TrendingUp,
  "trending-down-outline": OutlineIcons.TrendingDown,
  filter: FilledIcons.Filter,
  "filter-off-outline": OutlineIcons.FilterOff,
  "filter-2-outline": OutlineIcons.Filter2,
  "filter-2-x-outline": OutlineIcons.Filter2X,
  "filter-2-search-outline": OutlineIcons.Filter2Search,

  "external-link": FilledIcons.ExternalLink,
  "asterisk-outline": OutlineIcons.Asterisk,
  "square-asterisk": FilledIcons.SquareAsterisk,
  adjustments: FilledIcons.Adjustments,
  circles: FilledIcons.Circles,
  "trash-off-outline": OutlineIcons.TrashOff,
  "repeat-outline": OutlineIcons.Repeat,
  "playlist-x-outline": OutlineIcons.PlaylistX,
  "affiliate-outline": OutlineIcons.Affiliate,
  "hash-outline": OutlineIcons.Hash,
  "grip-horizontal-outline": OutlineIcons.GripHorizontal,
  "question-mark-outline": OutlineIcons.QuestionMark,
  "arrow-move-vertical-outline": OutlineIcons.ArrowsMoveVertical,
  "alert-square-rounded-outline": OutlineIcons.AlertSquareRounded,
  "address-book-outline": OutlineIcons.AddressBook,
  "switch-horizontal-outline": OutlineIcons.SwitchHorizontal,
  "arrows-diff-outline": OutlineIcons.ArrowsDiff,
  "home-share-outline": OutlineIcons.HomeShare,
  "share-outline": OutlineIcons.Share,
  "scale-outline": OutlineIcons.Scale,
  "caret-down-outline": OutlineIcons.CaretDown,
  "caret-up-outline": OutlineIcons.CaretUp,
  "history-toggle-outline": OutlineIcons.HistoryToggle,
  copy: FilledIcons.Copy,
  "receipt-outline": OutlineIcons.Receipt,

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
  "dice-outline": OutlineIcons.Dice,
  "wand-outline": OutlineIcons.Wand,
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
  "coins-outline": OutlineIcons.Coins,
  "file-invoice": FilledIcons.FileInvoice,
  "file-dollar": FilledIcons.FileDollar,
  exchange: FilledIcons.Exchange,
  "math-symbols-outline": OutlineIcons.MathSymbols,

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
  "snowflake-outline": OutlineIcons.Snowflake,
  "plant-outline": OutlineIcons.Plant,
  sun: FilledIcons.Sun,
  moon: FilledIcons.Moon,
  "moon-stars-outline": OutlineIcons.MoonStars,
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
  "shield-checkered-outline": OutlineIcons.ShieldCheckered,

  // People & Family
  "mood-happy": FilledIcons.MoodHappy,
  "baby-carriage": FilledIcons.BabyCarriage,
  man: FilledIcons.Man,
  woman: FilledIcons.Woman,
  paw: FilledIcons.Paw,
  "paw-print-outline": OutlineIcons.Paw,
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

  // Outline chrome variants (navigation, settings, preferences)
  "bell-outline": OutlineIcons.Bell,
  "calendar-outline": OutlineIcons.Calendar,
  "credit-card-outline": OutlineIcons.CreditCard,
  "archive-outline": OutlineIcons.Archive,
  "camera-outline": OutlineIcons.Camera,
  "circle-dot-outline": OutlineIcons.CircleDot,
  "clipboard-outline": OutlineIcons.Clipboard,
  "copy-outline": OutlineIcons.Copy,
  "files-outline": OutlineIcons.Files,
  "tag-outline": OutlineIcons.Tag,
  "x-outline": OutlineIcons.X,
  "file-outline": OutlineIcons.File,
  "basket-outline": OutlineIcons.Basket,
  "cash-banknote-outline": OutlineIcons.CashBanknote,
  "download-outline": OutlineIcons.Download,
  "lock-outline": OutlineIcons.Lock,
  "pencil-outline": OutlineIcons.Pencil,
  "star-outline": OutlineIcons.Star,
  "check-outline": OutlineIcons.Check,
  "info-circle-outline": OutlineIcons.InfoCircle,
  "arrow-up-circle-outline": OutlineIcons.ArrowUpCircle,
  "arrow-down-circle-outline": OutlineIcons.ArrowDownCircle,
  "photo-outline": OutlineIcons.Photo,
  "video-outline": OutlineIcons.Video,
  "chart-pie-outline": OutlineIcons.ChartPie,
  "circle-outline": OutlineIcons.Circle,
  "circles-outline": OutlineIcons.Circles,
  "clock-outline": OutlineIcons.Clock,
  "graph-outline": OutlineIcons.Graph,
  "list-details-outline": OutlineIcons.ListDetails,
  "map-pin-outline": OutlineIcons.MapPin,
  "plus-outline": OutlineIcons.Plus,
  "puzzle-outline": OutlineIcons.Puzzle,
  "settings-outline": OutlineIcons.Settings,
  "tags-outline": OutlineIcons.Tags,
  "trash-outline": OutlineIcons.Trash,
  "receipt-refund-outline": OutlineIcons.ReceiptRefund,
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

type IconStyle = StyleProp<Omit<ViewStyle, "color">>

type IconSymbolProps = Omit<SvgProps, "width" | "height"> & {
  name: IconSvgName
  /* default: 24 */
  size?: IconSize
  color?: string | OpaqueColorValue
  style?: IconStyle
}

export function IconSvg({
  name,
  size = 24,
  color,
  style,
  ...rest
}: IconSymbolProps) {
  const { theme } = useUnistyles()

  const resolved = ICON_MAP[name]

  if (!resolved && __DEV__) logger.warn(`IconSvg: unknown icon "${name}"`)

  const ResolvedIcon = (resolved ??
    ICON_MAP["question-mark-outline"]) as FC<SvgProps>

  const resolvedColor = color || theme.colors.primary

  return (
    <ResolvedIcon
      width={size}
      height={size}
      color={resolvedColor}
      style={style}
      {...rest}
    />
  )
}

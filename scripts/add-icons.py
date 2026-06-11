#!/usr/bin/env python3
"""
Moves selected icons back from unused-icons/ into src/components/icons/,
then regenerates the barrel index.ts files.
"""

import re
import shutil
from pathlib import Path

ROOT = Path(__file__).parent.parent
FILLED_SRC = ROOT / "src/components/icons/filled"
OUTLINE_SRC = ROOT / "src/components/icons/outline"
FILLED_UNUSED = ROOT / "unused-icons/filled"
OUTLINE_UNUSED = ROOT / "unused-icons/outline"

# (map-key, variant, ComponentName)
NEW_ICONS = [
    # Social & Brands
    ("brand-paypal",            "filled", "BrandPaypal"),
    ("brand-stripe",            "filled", "BrandStripe"),
    ("brand-whatsapp",          "filled", "BrandWhatsapp"),
    ("brand-facebook",          "filled", "BrandFacebook"),
    ("brand-instagram",         "filled", "BrandInstagram"),
    ("brand-twitter",           "filled", "BrandTwitter"),
    ("brand-youtube",           "filled", "BrandYoutube"),
    ("brand-spotify",           "filled", "BrandSpotify"),
    ("brand-linkedin",          "filled", "BrandLinkedin"),
    ("brand-google",            "filled", "BrandGoogle"),
    ("brand-apple",             "filled", "BrandApple"),

    # Food & Drink
    ("beer",                    "filled", "Beer"),
    ("bowl",                    "filled", "Bowl"),
    ("bowl-spoon",              "filled", "BowlSpoon"),
    ("bowl-chopsticks",         "filled", "BowlChopsticks"),
    ("bread",                   "filled", "Bread"),
    ("mug",                     "filled", "Mug"),
    ("milk",                    "filled", "Milk"),
    ("egg",                     "filled", "Egg"),
    ("egg-fried",               "filled", "EggFried"),
    ("salad",                   "filled", "Salad"),
    ("soup",                    "filled", "Soup"),
    ("chef-hat",                "filled", "ChefHat"),
    ("tools-kitchen-2",         "filled", "ToolsKitchen2"),
    ("dumpling",                "filled", "Dumpling"),
    ("bottle",                  "filled", "Bottle"),
    ("cookie",                  "filled", "Cookie"),
    ("cherry",                  "filled", "Cherry"),
    ("apple",                   "filled", "Apple"),
    ("melon",                   "filled", "Melon"),
    ("glass",                   "filled", "Glass"),
    ("glass-full",              "filled", "GlassFull"),

    # Health & Medical
    ("pill",                    "filled", "Pill"),
    ("medical-cross",           "filled", "MedicalCross"),
    ("bandage",                 "filled", "Bandage"),
    ("face-mask",               "filled", "FaceMask"),
    ("nurse",                   "filled", "Nurse"),
    ("lungs",                   "filled", "Lungs"),
    ("hospital-circle",         "filled", "HospitalCircle"),
    ("microscope",              "filled", "Microscope"),
    ("device-watch",            "filled", "DeviceWatch"),

    # Home & Living
    ("bed",                     "filled", "Bed"),
    ("bed-flat",                "filled", "BedFlat"),
    ("bath",                    "filled", "Bath"),
    ("home",                    "filled", "Home"),
    ("home-2",                  "filled", "Home2"),
    ("flower",                  "filled", "Flower"),
    ("leaf",                    "filled", "Leaf"),
    ("seedling",                "filled", "Seedling"),
    ("candle",                  "filled", "Candle"),
    ("blender",                 "filled", "Blender"),
    ("microwave",               "filled", "Microwave"),
    ("garden-cart",             "filled", "GardenCart"),
    ("elevator",                "filled", "Elevator"),

    # Travel & Transport
    ("plane",                   "filled", "Plane"),
    ("plane-arrival",           "filled", "PlaneArrival"),
    ("plane-departure",         "filled", "PlaneDeparture"),
    ("bus",                     "filled", "Bus"),
    ("train",                   "filled", "Train"),
    ("truck",                   "filled", "Truck"),
    ("ferry",                   "filled", "Ferry"),
    ("motorbike",               "filled", "Motorbike"),
    ("bike",                    "filled", "Bike"),
    ("compass",                 "filled", "Compass"),
    ("gas-station",             "filled", "GasStation"),
    ("steering-wheel",          "filled", "SteeringWheel"),
    ("caravan",                 "filled", "Caravan"),
    ("car-suv",                 "filled", "CarSuv"),
    ("car-4wd",                 "filled", "Car4Wd"),
    ("speedboat",               "filled", "Speedboat"),

    # Entertainment & Leisure
    ("headset",                 "filled", "Headset"),
    ("ticket",                  "filled", "Ticket"),
    ("trophy",                  "filled", "Trophy"),
    ("award",                   "filled", "Award"),
    ("golf",                    "filled", "Golf"),
    ("barbell",                 "filled", "Barbell"),
    ("sparkles",                "filled", "Sparkles"),
    ("sparkles-2",              "filled", "Sparkles2"),
    ("microphone",              "filled", "Microphone"),
    ("player-play",             "filled", "PlayerPlay"),
    ("player-pause",            "filled", "PlayerPause"),
    ("playlist",                "filled", "Playlist"),
    ("device-tv",               "filled", "DeviceTv"),
    ("device-gamepad",          "filled", "DeviceGamepad"),
    ("ball-bowling",            "filled", "BallBowling"),

    # Finance & Money
    ("receipt-dollar",          "filled", "ReceiptDollar"),
    ("receipt-euro",            "filled", "ReceiptEuro"),
    ("receipt-pound",           "filled", "ReceiptPound"),
    ("receipt-rupee",           "filled", "ReceiptRupee"),
    ("receipt-yen",             "filled", "ReceiptYen"),
    ("receipt-yuan",            "filled", "ReceiptYuan"),
    ("report-money",            "filled", "ReportMoney"),
    ("report-analytics",        "filled", "ReportAnalytics"),
    ("discount",                "filled", "Discount"),
    ("rosette-discount",        "filled", "RosetteDiscount"),
    ("rosette-discount-check",  "filled", "RosetteDiscountCheck"),
    ("zoom-money",              "filled", "ZoomMoney"),
    ("coin-bitcoin",            "filled", "CoinBitcoin"),
    ("coin-euro",               "filled", "CoinEuro"),
    ("coin-rupee",              "filled", "CoinRupee"),
    ("coin-yen",                "filled", "CoinYen"),
    ("coin-yuan",               "filled", "CoinYuan"),
    ("coin",                    "filled", "Coin"),
    ("file-invoice",            "filled", "FileInvoice"),
    ("file-dollar",             "filled", "FileDollar"),
    ("exchange",                "filled", "Exchange"),

    # Communication
    ("phone",                   "filled", "Phone"),
    ("phone-call",              "filled", "PhoneCall"),
    ("mail",                    "filled", "Mail"),
    ("mail-opened",             "filled", "MailOpened"),
    ("message",                 "filled", "Message"),
    ("message-2",               "filled", "Message2"),
    ("message-circle",          "filled", "MessageCircle"),
    ("message-report",          "filled", "MessageReport"),
    ("message-chatbot",         "filled", "MessageChatbot"),
    ("send",                    "filled", "Send"),
    ("messages",                "filled", "Messages"),

    # Work & Education
    ("book",                    "filled", "Book"),
    ("bookmark",                "filled", "Bookmark"),
    ("bookmarks",               "filled", "Bookmarks"),
    ("flag",                    "filled", "Flag"),
    ("flag-2",                  "filled", "Flag2"),
    ("dashboard",               "filled", "Dashboard"),
    ("crown",                   "filled", "Crown"),
    ("id",                      "filled", "Id"),
    ("writing",                 "filled", "Writing"),
    ("writing-sign",            "filled", "WritingSign"),
    ("keyboard",                "filled", "Keyboard"),
    ("briefcase-2",             "filled", "Briefcase2"),
    ("library",                 "filled", "Library"),
    ("library-plus",            "filled", "LibraryPlus"),

    # Clothing & Fashion
    ("shirt",                   "filled", "Shirt"),
    ("hanger-2",                "filled", "Hanger2"),
    ("sunglasses",              "filled", "Sunglasses"),
    ("umbrella",                "filled", "Umbrella"),
    ("diamond",                 "filled", "Diamond"),

    # Nature & Weather
    ("sun",                     "filled", "Sun"),
    ("moon",                    "filled", "Moon"),
    ("mountain",                "filled", "Mountain"),
    ("flame",                   "filled", "Flame"),
    ("cloud",                   "filled", "Cloud"),
    ("sunrise",                 "filled", "Sunrise"),
    ("sunset",                  "filled", "Sunset"),
    ("campfire",                "filled", "Campfire"),
    ("cactus",                  "filled", "Cactus"),
    ("bolt",                    "filled", "Bolt"),
    ("mushroom",                "filled", "Mushroom"),

    # Security & Identity
    ("key",                     "filled", "Key"),
    ("shield-check",            "filled", "ShieldCheck"),
    ("shield-lock",             "filled", "ShieldLock"),
    ("shield",                  "filled", "Shield"),

    # People & Family
    ("baby-carriage",           "filled", "BabyCarriage"),
    ("man",                     "filled", "Man"),
    ("woman",                   "filled", "Woman"),
    ("paw",                     "filled", "Paw"),
    ("lifebuoy",                "filled", "Lifebuoy"),
    ("thumb-up",                "filled", "ThumbUp"),
    ("thumb-down",              "filled", "ThumbDown"),

    # Tech & Devices
    ("download",                "filled", "Download"),
    ("link",                    "filled", "Link"),
    ("globe",                   "filled", "Globe"),
    ("world",                   "filled", "World"),
    ("satellite",               "filled", "Satellite"),
    ("cloud-computing",         "filled", "CloudComputing"),
    ("device-tablet",           "filled", "DeviceTablet"),
    ("device-speaker",          "filled", "DeviceSpeaker"),

    # Analytics
    ("analyze",                 "filled", "Analyze"),
    ("graph",                   "filled", "Graph"),
    ("chart-candle",            "filled", "ChartCandle"),
    ("chart-funnel",            "filled", "ChartFunnel"),
    ("chart-area",              "filled", "ChartArea"),
    ("chart-donut",             "filled", "ChartDonut"),
    ("chart-bubble",            "filled", "ChartBubble"),
    ("presentation-analytics",  "filled", "PresentationAnalytics"),

    # Time & Alerts
    ("hourglass",               "filled", "Hourglass"),
    ("alarm",                   "filled", "Alarm"),
    ("alarm-plus",              "filled", "AlarmPlus"),
    ("alarm-minus",             "filled", "AlarmMinus"),
    ("bell-ringing",            "filled", "BellRinging"),
    ("bell-plus",               "filled", "BellPlus"),
    ("bell-minus",              "filled", "BellMinus"),
    ("bell-x",                  "filled", "BellX"),

    # Location & Navigation
    ("pin",                     "filled", "Pin"),
    ("pinned",                  "filled", "Pinned"),
    ("navigation",              "filled", "Navigation"),

    # Shopping & Celebration
    ("trolley",                 "filled", "Trolley"),
    ("gift-card",               "filled", "GiftCard"),
    ("rosette",                 "filled", "Rosette"),
    ("confetti",                "filled", "Confetti"),
    ("balloon",                 "filled", "Balloon"),
    ("pennant",                 "filled", "Pennant"),
    ("pennant-2",               "filled", "Pennant2"),

    # Misc
    ("quote",                   "filled", "Quote"),
    ("table",                   "filled", "Table"),
    ("stack",                   "filled", "Stack"),
    ("timeline-event",          "filled", "TimelineEvent"),
    ("bulb",                    "filled", "Bulb"),
    ("atom-2",                  "filled", "Atom2"),
    ("magnet",                  "filled", "Magnet"),
    ("file-text",               "filled", "FileText"),
]

print(f"Total icons to add: {len(NEW_ICONS)}")

# ── 1. Move files back into src/ ───────────────────────────────────────────
moved = 0
missing = []
for key, variant, name in NEW_ICONS:
    src_dir = FILLED_UNUSED if variant == "filled" else OUTLINE_UNUSED
    dst_dir = FILLED_SRC if variant == "filled" else OUTLINE_SRC
    src_file = src_dir / f"{name}.tsx"
    dst_file = dst_dir / f"{name}.tsx"
    if src_file.exists():
        shutil.move(str(src_file), str(dst_file))
        moved += 1
    elif dst_file.exists():
        pass  # already in place
    else:
        missing.append((key, variant, name))

print(f"Moved: {moved}")
if missing:
    print(f"Missing ({len(missing)}):")
    for m in missing:
        print(f"  {m}")

# ── 2. Regenerate barrels ─────────────────────────────────────────────────
def regen_barrel(src_dir: Path):
    files = sorted(
        f.stem for f in src_dir.iterdir()
        if f.suffix == ".tsx" and f.name != "index.ts"
    )
    lines = [f'export {{ default as {n} }} from "./{n}"' for n in files]
    (src_dir / "index.ts").write_text("\n".join(lines) + "\n")
    print(f"  Barrel {src_dir.name}: {len(files)} exports")

regen_barrel(FILLED_SRC)
regen_barrel(OUTLINE_SRC)

# ── 3. Print ICON_MAP entries to paste into icon-svg.tsx ──────────────────
print("\n// ── Paste into icon-svg.tsx ICON_MAP ──")
section = None
for key, variant, name in NEW_ICONS:
    prefix = "FilledIcons" if variant == "filled" else "OutlineIcons"
    print(f'  "{key}": {prefix}.{name},')

print("\nDone.")

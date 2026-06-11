// ============================================================================
// Minty Theming System - Color Tokens
// ============================================================================

/**
 * Light theme entry: primary, secondary, and onSecondary all change per variant
 */
interface MintyLightColorEntry {
  primary: string
  secondary: string
  onSecondary: string
  lightThemeName: string
  darkThemeName: string
}

/**
 * Minty Light accent variants — primary + secondary + onSecondary
 */
export const MINTY_LIGHT_COLORS: readonly MintyLightColorEntry[] = [
  {
    primary: "#8600A5",
    secondary: "#F5CCFF",
    onSecondary: "#33004F",
    lightThemeName: "shadeOfViolet",
    darkThemeName: "electricLavender",
  },
  {
    primary: "#A50086",
    secondary: "#FFCCF5",
    onSecondary: "#4F004C",
    lightThemeName: "blissfulBerry",
    darkThemeName: "pinkQuartz",
  },
  {
    primary: "#A50048",
    secondary: "#FFCCE2",
    onSecondary: "#4F002E",
    lightThemeName: "cherryPlum",
    darkThemeName: "cottonCandy",
  },
  {
    primary: "#A5000A",
    secondary: "#FFCCCF",
    onSecondary: "#4F0011",
    lightThemeName: "crispChristmasCranberries",
    darkThemeName: "piglet",
  },
  {
    primary: "#A53300",
    secondary: "#FFDBCC",
    onSecondary: "#4F0C00",
    lightThemeName: "burntSienna",
    darkThemeName: "simplyDelicious",
  },
  {
    primary: "#845A00",
    secondary: "#FFEFCC",
    onSecondary: "#4F2900",
    lightThemeName: "soilOfAvagddu",
    darkThemeName: "creamyApricot",
  },
  {
    primary: "#747B00",
    secondary: "#FBFFCC",
    onSecondary: "#4F4700",
    lightThemeName: "flagGreen",
    darkThemeName: "yellYellow",
  },
  {
    primary: "#457B00",
    secondary: "#E8FFCC",
    onSecondary: "#384F00",
    lightThemeName: "tropicana",
    darkThemeName: "fallGreen",
  },
  {
    primary: "#177B00",
    secondary: "#D5FFCC",
    onSecondary: "#1B4F00",
    lightThemeName: "toyCamouflage",
    darkThemeName: "frostedMintHills",
  },
  {
    primary: "#007B17",
    secondary: "#CCFFD5",
    onSecondary: "#004F02",
    lightThemeName: "spreadsheetGreen",
    darkThemeName: "coastalTrim",
  },
  {
    primary: "#007B45",
    secondary: "#CCFFE8",
    onSecondary: "#004F20",
    lightThemeName: "tokiwaGreen",
    darkThemeName: "seafairGreen",
  },
  {
    primary: "#007B73",
    secondary: "#CCFFFB",
    onSecondary: "#004F3D",
    lightThemeName: "hydraTurquoise",
    darkThemeName: "crushedIce",
  },
  {
    primary: "#006694",
    secondary: "#CCEFFF",
    onSecondary: "#00424F",
    lightThemeName: "peacockBlue",
    darkThemeName: "iceEffect",
  },
  {
    primary: "#0033A5",
    secondary: "#CCDBFF",
    onSecondary: "#00254F",
    lightThemeName: "egyptianBlue",
    darkThemeName: "arcLight",
  },
  {
    primary: "#0A00A5",
    secondary: "#CFCCFF",
    onSecondary: "#00074F",
    lightThemeName: "bohemianBlue",
    darkThemeName: "driedLilac",
  },
  {
    primary: "#4800A5",
    secondary: "#E2CCFF",
    onSecondary: "#16004F",
    lightThemeName: "spaceBattleBlue",
    darkThemeName: "neonBoneyard",
  },
] as const

/**
 * Minty Dark / OLED primary accent colors (only primary changes from base)
 */
export const MINTY_DARK_PRIMARY_COLORS: readonly string[] = [
  "#F2C0FF", // electricLavender
  "#FFC0F4", // pinkQuartz
  "#FFC0DC", // cottonCandy
  "#FFC0C5", // piglet
  "#FFD2C0", // simplyDelicious
  "#FFEAC0", // creamyApricot
  "#FCFFC0", // yellYellow
  "#E4FFC0", // fallGreen
  "#CDFFC0", // frostedMintHills
  "#C0FFCA", // coastalTrim
  "#C0FFE2", // seafairGreen
  "#C0FFF9", // crushedIce
  "#C0ECFF", // iceEffect
  "#C0D4FF", // arcLight
  "#C2C0FF", // driedLilac
  "#DAC0FF", // neonBoneyard
] as const

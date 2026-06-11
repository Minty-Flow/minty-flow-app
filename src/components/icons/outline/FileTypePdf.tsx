import type { SvgProps } from "react-native-svg"
import Svg, { Path } from "react-native-svg"

const SvgFileTypePdf = (props: SvgProps) => (
  <Svg
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <Path d="M14 3v4a1 1 0 0 0 1 1h4" />
    <Path d="M5 12v-7a2 2 0 0 1 2 -2h7l5 5v4" />
    <Path d="M5 18h1.5a1.5 1.5 0 0 0 0 -3h-1.5v6" />
    <Path d="M17 18h2" />
    <Path d="M20 15h-3v6" />
    <Path d="M11 15v6h1a2 2 0 0 0 2 -2v-2a2 2 0 0 0 -2 -2h-1" />
  </Svg>
)
export default SvgFileTypePdf

import type { SvgProps } from "react-native-svg"
import Svg, { Path } from "react-native-svg"

const SvgPlaylistX = (props: SvgProps) => (
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
    <Path d="M19 8h-14" />
    <Path d="M5 12h7" />
    <Path d="M12 16h-7" />
    <Path d="M16 14l4 4" />
    <Path d="M20 14l-4 4" />
  </Svg>
)
export default SvgPlaylistX

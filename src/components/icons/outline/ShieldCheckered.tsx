import type { SvgProps } from "react-native-svg"
import Svg, { Path } from "react-native-svg"

const SvgShieldCheckered = (props: SvgProps) => (
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
    <Path d="M12 3a12 12 0 0 0 8.5 3a12 12 0 0 1 -8.5 15a12 12 0 0 1 -8.5 -15a12 12 0 0 0 8.5 -3" />
    <Path d="M12 3v18" />
    <Path d="M3.5 12h17" />
  </Svg>
)
export default SvgShieldCheckered

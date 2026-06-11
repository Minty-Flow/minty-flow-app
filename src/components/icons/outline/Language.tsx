import type { SvgProps } from "react-native-svg"
import Svg, { Path } from "react-native-svg"

const SvgLanguage = (props: SvgProps) => (
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
    <Path d="M9 6.371c0 4.418 -2.239 6.629 -5 6.629" />
    <Path d="M4 6.371h7" />
    <Path d="M5 9c0 2.144 2.252 3.908 6 4" />
    <Path d="M12 20l4 -9l4 9" />
    <Path d="M19.1 18h-6.2" />
    <Path d="M6.694 3l.793 .582" />
  </Svg>
)
export default SvgLanguage

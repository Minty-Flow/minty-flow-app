import type { SvgProps } from "react-native-svg"
import Svg, { Path } from "react-native-svg"

const SvgMathSymbols = (props: SvgProps) => (
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
    <Path d="M3 12l18 0" />
    <Path d="M12 3l0 18" />
    <Path d="M16.5 4.5l3 3" />
    <Path d="M19.5 4.5l-3 3" />
    <Path d="M6 4l0 4" />
    <Path d="M4 6l4 0" />
    <Path d="M18 16l.01 0" />
    <Path d="M18 20l.01 0" />
    <Path d="M4 18l4 0" />
  </Svg>
)
export default SvgMathSymbols

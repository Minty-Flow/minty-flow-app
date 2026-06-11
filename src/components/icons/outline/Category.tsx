import type { SvgProps } from "react-native-svg"
import Svg, { Path } from "react-native-svg"

const SvgCategory = (props: SvgProps) => (
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
    <Path d="M4 4h6v6h-6l0 -6" />
    <Path d="M14 4h6v6h-6l0 -6" />
    <Path d="M4 14h6v6h-6l0 -6" />
    <Path d="M14 17a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
  </Svg>
)
export default SvgCategory

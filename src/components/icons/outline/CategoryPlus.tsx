import type { SvgProps } from "react-native-svg"
import Svg, { Path } from "react-native-svg"

const SvgCategoryPlus = (props: SvgProps) => (
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
    <Path d="M4 4h6v6h-6v-6" />
    <Path d="M14 4h6v6h-6v-6" />
    <Path d="M4 14h6v6h-6v-6" />
    <Path d="M14 17h6m-3 -3v6" />
  </Svg>
)
export default SvgCategoryPlus

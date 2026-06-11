import type { SvgProps } from "react-native-svg"
import Svg, { Path } from "react-native-svg"

const SvgAnchor = (props: SvgProps) => (
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
    <Path d="M12 9v12m-8 -8a8 8 0 0 0 16 0m1 0h-2m-14 0h-2" />
    <Path d="M9 6a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
  </Svg>
)
export default SvgAnchor

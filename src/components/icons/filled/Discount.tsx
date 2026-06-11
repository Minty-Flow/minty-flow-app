import type { SvgProps } from "react-native-svg"
import Svg, { Path } from "react-native-svg"

const SvgDiscount = (props: SvgProps) => (
  <Svg
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    <Path d="M17 3.34a10 10 0 1 1 -15 8.66l.005 -.324a10 10 0 0 1 14.995 -8.336m-2.5 9.66a1.5 1.5 0 1 0 0 3a1.5 1.5 0 0 0 0 -3m1.207 -4.707a1 1 0 0 0 -1.414 0l-6 6a1 1 0 0 0 1.414 1.414l6 -6a1 1 0 0 0 0 -1.414m-6.207 -.293a1.5 1.5 0 1 0 0 3a1.5 1.5 0 0 0 0 -3" />
  </Svg>
)
export default SvgDiscount

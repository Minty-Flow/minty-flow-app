import type { SvgProps } from "react-native-svg"
import Svg, { Path } from "react-native-svg"

const SvgCircle = (props: SvgProps) => (
  <Svg
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    <Path d="M7 3.34a10 10 0 1 1 -4.995 8.984l-.005 -.324l.005 -.324a10 10 0 0 1 4.995 -8.336z" />
  </Svg>
)
export default SvgCircle

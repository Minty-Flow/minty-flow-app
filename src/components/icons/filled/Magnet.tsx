import type { SvgProps } from "react-native-svg"
import Svg, { Path } from "react-native-svg"

const SvgMagnet = (props: SvgProps) => (
  <Svg
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    <Path d="M21 9v4a9 9 0 0 1 -18 0v-4h7v4a2 2 0 1 0 4 0v-4zm-3 -7a3 3 0 0 1 3 3v2h-7v-2a3 3 0 0 1 3 -3zm-11 0a3 3 0 0 1 3 3v2h-7v-2a3 3 0 0 1 3 -3z" />
  </Svg>
)
export default SvgMagnet

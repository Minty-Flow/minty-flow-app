import type { SvgProps } from "react-native-svg"
import Svg, { Path } from "react-native-svg"

const SvgCar4Wd = (props: SvgProps) => (
  <Svg
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    <Path d="M17 2a3 3 0 0 1 3 3v2a3 3 0 0 1 -6 0h-1v10h1a3 3 0 0 1 6 0v2a3 3 0 0 1 -6 0h-4a3 3 0 0 1 -6 0v-2a3 3 0 0 1 6 0h1v-10h-1a3 3 0 1 1 -6 0v-2a3 3 0 1 1 6 0h4a3 3 0 0 1 3 -3" />
  </Svg>
)
export default SvgCar4Wd

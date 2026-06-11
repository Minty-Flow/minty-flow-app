import type { SvgProps } from "react-native-svg"
import Svg, { Path } from "react-native-svg"

const SvgMilk = (props: SvgProps) => (
  <Svg
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    <Path d="M17.799 7l.144 .23a7 7 0 0 1 1.057 3.7v8.07a3 3 0 0 1 -3 3h-8a3 3 0 0 1 -3 -3v-8.071a7 7 0 0 1 1.057 -3.698l.142 -.231zm-5.799 6a3 3 0 0 0 -2.995 2.824l-.005 .176a3 3 0 1 0 3 -3m0 2a1 1 0 1 1 0 2a1 1 0 0 1 0 -2m2 -6h-4a1 1 0 1 0 0 2h4a1 1 0 0 0 0 -2m1 -7a2 2 0 0 1 2 2v1h-10v-1a2 2 0 0 1 2 -2z" />
  </Svg>
)
export default SvgMilk

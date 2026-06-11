import type { SvgProps } from "react-native-svg"
import Svg, { Path } from "react-native-svg"

const SvgMelon = (props: SvgProps) => (
  <Svg
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    <Path d="M16.77 2.62a1 1 0 0 1 1.436 .055a10.96 10.96 0 0 1 2.794 7.326c0 6.074 -4.925 10.999 -10.999 10.999a10.97 10.97 0 0 1 -7.684 -3.127a1 1 0 0 1 .008 -1.438l4.343 -4.153a1 1 0 0 1 1.352 -.027a3 3 0 0 0 4.32 -4.133a1 1 0 0 1 .088 -1.35z" />
  </Svg>
)
export default SvgMelon

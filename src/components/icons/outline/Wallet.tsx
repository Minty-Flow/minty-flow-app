import type { SvgProps } from "react-native-svg"
import Svg, { Path } from "react-native-svg"

const SvgWallet = (props: SvgProps) => (
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
    <Path d="M17 8v-3a1 1 0 0 0 -1 -1h-10a2 2 0 0 0 0 4h12a1 1 0 0 1 1 1v3m0 4v3a1 1 0 0 1 -1 1h-12a2 2 0 0 1 -2 -2v-12" />
    <Path d="M20 12v4h-4a2 2 0 0 1 0 -4h4" />
  </Svg>
)
export default SvgWallet

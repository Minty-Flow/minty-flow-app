import type { SvgProps } from "react-native-svg"
import Svg, { Path } from "react-native-svg"

const SvgScale = (props: SvgProps) => (
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
    <Path d="M7 20l10 0" />
    <Path d="M6 6l6 -1l6 1" />
    <Path d="M12 3l0 17" />
    <Path d="M9 12l-3 -6l-3 6a3 3 0 0 0 6 0" />
    <Path d="M21 12l-3 -6l-3 6a3 3 0 0 0 6 0" />
  </Svg>
)
export default SvgScale

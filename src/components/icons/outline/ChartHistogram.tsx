import type { SvgProps } from "react-native-svg"
import Svg, { Path } from "react-native-svg"

const SvgChartHistogram = (props: SvgProps) => (
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
    <Path d="M3 3v18h18" />
    <Path d="M20 18v3" />
    <Path d="M16 16v5" />
    <Path d="M12 13v8" />
    <Path d="M8 16v5" />
    <Path d="M3 11c6 0 5 -5 9 -5s3 5 9 5" />
  </Svg>
)
export default SvgChartHistogram

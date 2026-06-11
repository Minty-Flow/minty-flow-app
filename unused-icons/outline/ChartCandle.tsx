import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgChartCandle = (props: SvgProps) => (
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
    <Path d="M4 7a1 1 0 0 1 1 -1h2a1 1 0 0 1 1 1v3a1 1 0 0 1 -1 1h-2a1 1 0 0 1 -1 -1l0 -3" />
    <Path d="M6 4l0 2" />
    <Path d="M6 11l0 9" />
    <Path d="M10 15a1 1 0 0 1 1 -1h2a1 1 0 0 1 1 1v3a1 1 0 0 1 -1 1h-2a1 1 0 0 1 -1 -1l0 -3" />
    <Path d="M12 4l0 10" />
    <Path d="M12 19l0 1" />
    <Path d="M16 6a1 1 0 0 1 1 -1h2a1 1 0 0 1 1 1v4a1 1 0 0 1 -1 1h-2a1 1 0 0 1 -1 -1l0 -4" />
    <Path d="M18 4l0 1" />
    <Path d="M18 11l0 9" />
  </Svg>
);
export default SvgChartCandle;

import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgChartCircles = (props: SvgProps) => (
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
    <Path d="M4 9.5a5.5 5.5 0 1 0 11 0a5.5 5.5 0 1 0 -11 0" />
    <Path d="M9 14.5a5.5 5.5 0 1 0 11 0a5.5 5.5 0 1 0 -11 0" />
  </Svg>
);
export default SvgChartCircles;

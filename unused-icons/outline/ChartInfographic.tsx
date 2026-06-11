import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgChartInfographic = (props: SvgProps) => (
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
    <Path d="M3 7a4 4 0 1 0 8 0a4 4 0 1 0 -8 0" />
    <Path d="M7 3v4h4" />
    <Path d="M9 17l0 4" />
    <Path d="M17 14l0 7" />
    <Path d="M13 13l0 8" />
    <Path d="M21 12l0 9" />
  </Svg>
);
export default SvgChartInfographic;

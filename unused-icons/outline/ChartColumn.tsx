import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgChartColumn = (props: SvgProps) => (
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
    <Path d="M4 20h3" />
    <Path d="M17 20h3" />
    <Path d="M10.5 20h3" />
    <Path d="M4 16h3" />
    <Path d="M17 16h3" />
    <Path d="M10.5 16h3" />
    <Path d="M4 12h3" />
    <Path d="M17 12h3" />
    <Path d="M10.5 12h3" />
    <Path d="M4 8h3" />
    <Path d="M17 8h3" />
    <Path d="M4 4h3" />
  </Svg>
);
export default SvgChartColumn;

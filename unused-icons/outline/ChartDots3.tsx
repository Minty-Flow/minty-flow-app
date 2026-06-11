import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgChartDots3 = (props: SvgProps) => (
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
    <Path d="M3 7a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
    <Path d="M14 15a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
    <Path d="M15 6a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
    <Path d="M3 18a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
    <Path d="M9 17l5 -1.5" />
    <Path d="M6.5 8.5l7.81 5.37" />
    <Path d="M7 7l8 -1" />
  </Svg>
);
export default SvgChartDots3;

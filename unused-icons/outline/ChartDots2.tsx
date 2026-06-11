import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgChartDots2 = (props: SvgProps) => (
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
    <Path d="M7 15a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
    <Path d="M11 5a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
    <Path d="M16 12a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
    <Path d="M21 3l-6 1.5" />
    <Path d="M14.113 6.65l2.771 3.695" />
    <Path d="M16 12.5l-5 2" />
  </Svg>
);
export default SvgChartDots2;

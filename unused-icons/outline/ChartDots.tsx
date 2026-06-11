import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgChartDots = (props: SvgProps) => (
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
    <Path d="M7 9a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
    <Path d="M17 7a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
    <Path d="M12 15a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
    <Path d="M10.16 10.62l2.34 2.88" />
    <Path d="M15.088 13.328l2.837 -4.586" />
  </Svg>
);
export default SvgChartDots;

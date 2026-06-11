import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgDashboardOff = (props: SvgProps) => (
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
    <Path d="M11.175 11.178a2 2 0 1 0 2.653 2.634" />
    <Path d="M14.5 10.5l1 -1" />
    <Path d="M8.621 4.612a9 9 0 0 1 11.721 11.72m-1.516 2.488a9.008 9.008 0 0 1 -1.226 1.18h-11.2a9 9 0 0 1 -.268 -13.87" />
    <Path d="M3 3l18 18" />
  </Svg>
);
export default SvgDashboardOff;

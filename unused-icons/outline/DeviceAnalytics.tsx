import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgDeviceAnalytics = (props: SvgProps) => (
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
    <Path d="M3 5a1 1 0 0 1 1 -1h16a1 1 0 0 1 1 1v10a1 1 0 0 1 -1 1h-16a1 1 0 0 1 -1 -1l0 -10" />
    <Path d="M7 20l10 0" />
    <Path d="M9 16l0 4" />
    <Path d="M15 16l0 4" />
    <Path d="M8 12l3 -3l2 2l3 -3" />
  </Svg>
);
export default SvgDeviceAnalytics;

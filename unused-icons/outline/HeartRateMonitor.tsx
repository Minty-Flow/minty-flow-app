import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgHeartRateMonitor = (props: SvgProps) => (
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
    <Path d="M7 20h10" />
    <Path d="M9 16v4" />
    <Path d="M15 16v4" />
    <Path d="M7 10h2l2 3l2 -6l1 3h3" />
  </Svg>
);
export default SvgHeartRateMonitor;

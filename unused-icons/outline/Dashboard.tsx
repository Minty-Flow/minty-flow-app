import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgDashboard = (props: SvgProps) => (
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
    <Path d="M10 13a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
    <Path d="M13.45 11.55l2.05 -2.05" />
    <Path d="M6.4 20a9 9 0 1 1 11.2 0l-11.2 0" />
  </Svg>
);
export default SvgDashboard;

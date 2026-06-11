import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgHours12 = (props: SvgProps) => (
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
    <Path d="M20 11a8.1 8.1 0 0 0 -15.5 -2m-.5 -4v4h4" />
    <Path d="M4 13c.468 3.6 3.384 6.546 7 7" />
    <Path d="M18 15h2a1 1 0 0 1 1 1v1a1 1 0 0 1 -1 1h-1a1 1 0 0 0 -1 1v1a1 1 0 0 0 1 1h2" />
    <Path d="M15 21v-6" />
  </Svg>
);
export default SvgHours12;

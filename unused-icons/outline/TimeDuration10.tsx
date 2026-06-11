import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgTimeDuration10 = (props: SvgProps) => (
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
    <Path d="M9 9v6" />
    <Path d="M12 11v2a2 2 0 1 0 4 0v-2a2 2 0 1 0 -4 0" />
    <Path d="M3 12v.01" />
    <Path d="M21 12v.01" />
    <Path d="M12 21v.01" />
    <Path d="M7.5 4.2v.01" />
    <Path d="M16.5 19.8v.01" />
    <Path d="M7.5 19.8v.01" />
    <Path d="M4.2 16.5v.01" />
    <Path d="M19.8 16.5v.01" />
    <Path d="M4.2 7.5v.01" />
    <Path d="M19.81 7.527a8.994 8.994 0 0 0 -7.81 -4.527" />
  </Svg>
);
export default SvgTimeDuration10;

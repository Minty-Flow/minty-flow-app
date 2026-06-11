import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgUsers = (props: SvgProps) => (
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
    <Path d="M5 7a4 4 0 1 0 8 0a4 4 0 1 0 -8 0" />
    <Path d="M3 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" />
    <Path d="M16 3.13a4 4 0 0 1 0 7.75" />
    <Path d="M21 21v-2a4 4 0 0 0 -3 -3.85" />
  </Svg>
);
export default SvgUsers;

import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgBroadcast = (props: SvgProps) => (
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
    <Path d="M18.364 19.364a9 9 0 1 0 -12.728 0" />
    <Path d="M15.536 16.536a5 5 0 1 0 -7.072 0" />
    <Path d="M11 13a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
  </Svg>
);
export default SvgBroadcast;

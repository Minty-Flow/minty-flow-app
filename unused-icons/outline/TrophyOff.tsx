import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgTrophyOff = (props: SvgProps) => (
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
    <Path d="M8 21h8" />
    <Path d="M12 17v4" />
    <Path d="M8 4h9" />
    <Path d="M17 4v8c0 .31 -.028 .612 -.082 .905m-1.384 2.632a5 5 0 0 1 -8.534 -3.537v-5" />
    <Path d="M3 9a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
    <Path d="M17 9a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
    <Path d="M3 3l18 18" />
  </Svg>
);
export default SvgTrophyOff;

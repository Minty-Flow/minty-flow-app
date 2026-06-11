import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgBlind = (props: SvgProps) => (
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
    <Path d="M9 4a1 1 0 1 0 2 0a1 1 0 0 0 -2 0" />
    <Path d="M4 21l3 -4" />
    <Path d="M13 21l-2 -4l-3 -3l1 -6" />
    <Path d="M3 12l2 -3l4 -1l6 4" />
    <Path d="M16.5 14l3.5 7" />
  </Svg>
);
export default SvgBlind;

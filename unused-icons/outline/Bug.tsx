import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgBug = (props: SvgProps) => (
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
    <Path d="M9 9v-1a3 3 0 0 1 6 0v1" />
    <Path d="M8 9h8a6 6 0 0 1 1 3v3a5 5 0 0 1 -10 0v-3a6 6 0 0 1 1 -3" />
    <Path d="M3 13l4 0" />
    <Path d="M17 13l4 0" />
    <Path d="M12 20l0 -6" />
    <Path d="M4 19l3.35 -2" />
    <Path d="M20 19l-3.35 -2" />
    <Path d="M4 7l3.75 2.4" />
    <Path d="M20 7l-3.75 2.4" />
  </Svg>
);
export default SvgBug;

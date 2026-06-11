import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgWreckingBall = (props: SvgProps) => (
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
    <Path d="M17 13a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
    <Path d="M2 17a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
    <Path d="M11 17a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
    <Path d="M13 19l-9 0" />
    <Path d="M4 15l9 0" />
    <Path d="M8 12v-5h2a3 3 0 0 1 3 3v5" />
    <Path d="M5 15v-2a1 1 0 0 1 1 -1h7" />
    <Path d="M19 11v-7l-6 7" />
  </Svg>
);
export default SvgWreckingBall;

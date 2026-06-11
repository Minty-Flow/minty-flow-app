import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgUTurnLeft = (props: SvgProps) => (
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
    <Path d="M17 20v-11.5a4.5 4.5 0 1 0 -9 0v8.5" />
    <Path d="M11 14l-3 3l-3 -3" />
  </Svg>
);
export default SvgUTurnLeft;

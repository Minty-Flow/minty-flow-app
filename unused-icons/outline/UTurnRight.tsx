import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgUTurnRight = (props: SvgProps) => (
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
    <Path d="M7 20v-11.5a4.5 4.5 0 0 1 9 0v8.5" />
    <Path d="M13 14l3 3l3 -3" />
  </Svg>
);
export default SvgUTurnRight;

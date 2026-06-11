import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgArrowSharpTurnRight = (props: SvgProps) => (
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
    <Path d="M7 18v-11.31a.7 .7 0 0 1 1.195 -.495l9.805 9.805" />
    <Path d="M13 16h5v-5" />
  </Svg>
);
export default SvgArrowSharpTurnRight;

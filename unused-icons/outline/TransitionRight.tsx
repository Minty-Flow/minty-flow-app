import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgTransitionRight = (props: SvgProps) => (
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
    <Path d="M18 3a3 3 0 0 1 3 3v12a3 3 0 0 1 -3 3" />
    <Path d="M3 18v-12a3 3 0 1 1 6 0v12a3 3 0 0 1 -6 0" />
    <Path d="M9 12h8" />
    <Path d="M14 15l3 -3l-3 -3" />
  </Svg>
);
export default SvgTransitionRight;

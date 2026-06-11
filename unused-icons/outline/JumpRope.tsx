import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgJumpRope = (props: SvgProps) => (
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
    <Path d="M6 14v-6a3 3 0 1 1 6 0v8a3 3 0 0 0 6 0v-6" />
    <Path d="M16 5a2 2 0 0 1 2 -2a2 2 0 0 1 2 2v3a2 2 0 0 1 -2 2a2 2 0 0 1 -2 -2l0 -3" />
    <Path d="M4 16a2 2 0 0 1 2 -2a2 2 0 0 1 2 2v3a2 2 0 0 1 -2 2a2 2 0 0 1 -2 -2l0 -3" />
  </Svg>
);
export default SvgJumpRope;

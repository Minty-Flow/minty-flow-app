import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgCliffJumping = (props: SvgProps) => (
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
    <Path d="M14 7a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
    <Path d="M10.5 18l2.5 2l2 -2" />
    <Path d="M18 21l3 -3l-4 -2l-1 -5" />
    <Path d="M10.5 7.5l2 3l3.5 .5l3 -2l.5 -3" />
    <Path d="M4 21v-1l2 -3l.5 -2.5l1.5 -2.5l-1 -5l1 -3l-1 -1l-2 .5l-2 -.5" />
  </Svg>
);
export default SvgCliffJumping;

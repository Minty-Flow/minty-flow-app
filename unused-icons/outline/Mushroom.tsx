import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgMushroom = (props: SvgProps) => (
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
    <Path d="M20 11.1c0 -4.474 -3.582 -8.1 -8 -8.1s-8 3.626 -8 8.1a.9 .9 0 0 0 .9 .9h14.2a.9 .9 0 0 0 .9 -.9" />
    <Path d="M10 12v7a2 2 0 1 0 4 0v-7" />
  </Svg>
);
export default SvgMushroom;

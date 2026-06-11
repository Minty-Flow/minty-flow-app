import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgArrowsRandom = (props: SvgProps) => (
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
    <Path d="M20 21h-4v-4" />
    <Path d="M16 21l5 -5" />
    <Path d="M6.5 9.504l-3.5 -2l2 -3.504" />
    <Path d="M3 7.504l6.83 -1.87" />
    <Path d="M4 16l4 -1l1 4" />
    <Path d="M8 15l-3.5 6" />
    <Path d="M21 5l-.5 4l-4 -.5" />
    <Path d="M20.5 9l-4.5 -5.5" />
  </Svg>
);
export default SvgArrowsRandom;

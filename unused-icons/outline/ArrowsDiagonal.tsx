import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgArrowsDiagonal = (props: SvgProps) => (
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
    <Path d="M16 4l4 0l0 4" />
    <Path d="M14 10l6 -6" />
    <Path d="M8 20l-4 0l0 -4" />
    <Path d="M4 20l6 -6" />
  </Svg>
);
export default SvgArrowsDiagonal;

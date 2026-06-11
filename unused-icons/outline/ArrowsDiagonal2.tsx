import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgArrowsDiagonal2 = (props: SvgProps) => (
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
    <Path d="M16 20l4 0l0 -4" />
    <Path d="M14 14l6 6" />
    <Path d="M8 4l-4 0l0 4" />
    <Path d="M4 4l6 6" />
  </Svg>
);
export default SvgArrowsDiagonal2;

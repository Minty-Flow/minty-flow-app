import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgCornerRightDownDouble = (props: SvgProps) => (
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
    <Path d="M5 4h6a3 3 0 0 1 3 3v7" />
    <Path d="M10 10l4 4l4 -4m-8 5l4 4l4 -4" />
  </Svg>
);
export default SvgCornerRightDownDouble;

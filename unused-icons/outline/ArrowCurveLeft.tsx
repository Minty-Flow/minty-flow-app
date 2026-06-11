import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgArrowCurveLeft = (props: SvgProps) => (
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
    <Path d="M14 7l-4 -4l-4 4" />
    <Path d="M10 3v4.394a6.737 6.737 0 0 0 3 5.606a6.737 6.737 0 0 1 3 5.606v2.394" />
  </Svg>
);
export default SvgArrowCurveLeft;

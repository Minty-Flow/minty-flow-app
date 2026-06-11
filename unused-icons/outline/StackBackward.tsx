import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgStackBackward = (props: SvgProps) => (
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
    <Path d="M14 12l6 -3l-8 -4l-8 4l6 3" />
    <Path d="M10 12l-6 3l8 4l8 -4l-6 -3l-2 1l-2 -1" fill="currentColor" />
  </Svg>
);
export default SvgStackBackward;

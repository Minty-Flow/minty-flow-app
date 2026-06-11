import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgStackFront = (props: SvgProps) => (
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
    <Path d="M12 4l-8 4l8 4l8 -4l-8 -4" fill="currentColor" />
    <Path d="M8 14l-4 2l8 4l8 -4l-4 -2" />
    <Path d="M8 10l-4 2l8 4l8 -4l-4 -2" />
  </Svg>
);
export default SvgStackFront;

import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgStackForward = (props: SvgProps) => (
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
    <Path d="M12 5l-8 4l8 4l8 -4l-8 -4" fill="currentColor" />
    <Path d="M10 12l-6 3l8 4l8 -4l-6 -3" />
  </Svg>
);
export default SvgStackForward;

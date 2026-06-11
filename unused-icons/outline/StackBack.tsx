import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgStackBack = (props: SvgProps) => (
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
    <Path d="M4 8l8 4l8 -4l-8 -4l-8 4" />
    <Path d="M12 16l-4 -2l-4 2l8 4l8 -4l-4 -2l-4 2" fill="currentColor" />
    <Path d="M8 10l-4 2l4 2m8 0l4 -2l-4 -2" />
  </Svg>
);
export default SvgStackBack;

import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgStackPush = (props: SvgProps) => (
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
    <Path d="M6 10l-2 1l8 4l8 -4l-2 -1" />
    <Path d="M4 15l8 4l8 -4" />
    <Path d="M12 4v7" />
    <Path d="M15 8l-3 3l-3 -3" />
  </Svg>
);
export default SvgStackPush;

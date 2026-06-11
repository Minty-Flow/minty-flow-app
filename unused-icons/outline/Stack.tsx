import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgStack = (props: SvgProps) => (
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
    <Path d="M12 6l-8 4l8 4l8 -4l-8 -4" />
    <Path d="M4 14l8 4l8 -4" />
  </Svg>
);
export default SvgStack;

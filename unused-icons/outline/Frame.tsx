import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgFrame = (props: SvgProps) => (
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
    <Path d="M4 7l16 0" />
    <Path d="M4 17l16 0" />
    <Path d="M7 4l0 16" />
    <Path d="M17 4l0 16" />
  </Svg>
);
export default SvgFrame;

import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgArrowsRight = (props: SvgProps) => (
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
    <Path d="M21 17l-18 0" />
    <Path d="M18 4l3 3l-3 3" />
    <Path d="M18 20l3 -3l-3 -3" />
    <Path d="M21 7l-18 0" />
  </Svg>
);
export default SvgArrowsRight;

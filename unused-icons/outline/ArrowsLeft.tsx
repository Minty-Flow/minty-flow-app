import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgArrowsLeft = (props: SvgProps) => (
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
    <Path d="M3 7l18 0" />
    <Path d="M6 20l-3 -3l3 -3" />
    <Path d="M6 4l-3 3l3 3" />
    <Path d="M3 17l18 0" />
  </Svg>
);
export default SvgArrowsLeft;

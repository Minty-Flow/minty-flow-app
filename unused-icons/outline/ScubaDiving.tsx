import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgScubaDiving = (props: SvgProps) => (
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
    <Path d="M19 12a1 1 0 1 0 2 0a1 1 0 0 0 -2 0" />
    <Path d="M2 2l3 3l1.5 4l3.5 2l6 2l1 4l2.5 3" />
    <Path d="M11 8l4.5 1.5" />
  </Svg>
);
export default SvgScubaDiving;

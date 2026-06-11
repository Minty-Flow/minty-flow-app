import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgPencilOff = (props: SvgProps) => (
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
    <Path d="M10 10l-6 6v4h4l6 -6m1.99 -1.99l2.504 -2.504a2.828 2.828 0 1 0 -4 -4l-2.5 2.5" />
    <Path d="M13.5 6.5l4 4" />
    <Path d="M3 3l18 18" />
  </Svg>
);
export default SvgPencilOff;

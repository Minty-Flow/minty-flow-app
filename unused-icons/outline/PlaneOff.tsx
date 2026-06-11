import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgPlaneOff = (props: SvgProps) => (
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
    <Path d="M9.788 5.758l-.788 -2.758h3l4 7h4a2 2 0 1 1 0 4h-2m-2.718 1.256l-3.282 5.744h-3l2 -7h-4l-2 2h-3l2 -4l-2 -4h3l2 2h3" />
    <Path d="M3 3l18 18" />
  </Svg>
);
export default SvgPlaneOff;

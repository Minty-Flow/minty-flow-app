import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgDialpadOff = (props: SvgProps) => (
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
    <Path d="M7 7h-4v-4" />
    <Path d="M17 3h4v4h-4l0 -4" />
    <Path d="M10 6v-3h4v4h-3" />
    <Path d="M3 10h4v4h-4l0 -4" />
    <Path d="M17 13v-3h4v4h-3" />
    <Path d="M14 14h-4v-4" />
    <Path d="M10 17h4v4h-4l0 -4" />
    <Path d="M3 3l18 18" />
  </Svg>
);
export default SvgDialpadOff;

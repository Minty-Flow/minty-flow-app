import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgPennantOff = (props: SvgProps) => (
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
    <Path d="M8 21h4" />
    <Path d="M10 21v-11m0 -4v-3" />
    <Path d="M10 4l9 4l-4.858 2.16m-2.764 1.227l-1.378 .613" />
    <Path d="M3 3l18 18" />
  </Svg>
);
export default SvgPennantOff;

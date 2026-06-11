import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgPolygonOff = (props: SvgProps) => (
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
    <Path d="M10 5a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
    <Path d="M17 8a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
    <Path d="M3 11a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
    <Path d="M13 19a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
    <Path d="M6.5 9.5l1.546 -1.311" />
    <Path d="M14 5.5l3 1.5" />
    <Path d="M18.5 10l-1.185 3.318m-1.062 2.972l-.253 .71" />
    <Path d="M13.5 17.5l-7 -5" />
    <Path d="M3 3l18 18" />
  </Svg>
);
export default SvgPolygonOff;

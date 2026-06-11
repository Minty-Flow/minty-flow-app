import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgSortDescending2 = (props: SvgProps) => (
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
    <Path d="M5 5.5a.5 .5 0 0 1 .5 -.5h4a.5 .5 0 0 1 .5 .5v4a.5 .5 0 0 1 -.5 .5h-4a.5 .5 0 0 1 -.5 -.5l0 -4" />
    <Path d="M5 14.5a.5 .5 0 0 1 .5 -.5h4a.5 .5 0 0 1 .5 .5v4a.5 .5 0 0 1 -.5 .5h-4a.5 .5 0 0 1 -.5 -.5l0 -4" />
    <Path d="M14 15l3 3l3 -3" />
    <Path d="M17 18v-12" />
  </Svg>
);
export default SvgSortDescending2;

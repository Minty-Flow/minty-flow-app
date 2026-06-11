import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgCalendarClock = (props: SvgProps) => (
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
    <Path d="M10.5 21h-4.5a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v3" />
    <Path d="M16 3v4" />
    <Path d="M8 3v4" />
    <Path d="M4 11h10" />
    <Path d="M14 18a4 4 0 1 0 8 0a4 4 0 1 0 -8 0" />
    <Path d="M18 16.5v1.5l.5 .5" />
  </Svg>
);
export default SvgCalendarClock;

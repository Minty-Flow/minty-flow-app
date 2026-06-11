import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgCalendarMonth = (props: SvgProps) => (
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
    <Path d="M4 7a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2v-12" />
    <Path d="M16 3v4" />
    <Path d="M8 3v4" />
    <Path d="M4 11h16" />
    <Path d="M8 14v4" />
    <Path d="M12 14v4" />
    <Path d="M16 14v4" />
  </Svg>
);
export default SvgCalendarMonth;

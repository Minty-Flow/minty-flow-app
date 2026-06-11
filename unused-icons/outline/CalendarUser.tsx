import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgCalendarUser = (props: SvgProps) => (
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
    <Path d="M12 21h-6a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v4.5" />
    <Path d="M16 3v4" />
    <Path d="M8 3v4" />
    <Path d="M4 11h16" />
    <Path d="M17 17a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
    <Path d="M22 22a2 2 0 0 0 -2 -2h-2a2 2 0 0 0 -2 2" />
  </Svg>
);
export default SvgCalendarUser;

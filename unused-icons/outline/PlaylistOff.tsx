import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgPlaylistOff = (props: SvgProps) => (
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
    <Path d="M14 14a3 3 0 1 0 3 3" />
    <Path d="M17 13v-9h4" />
    <Path d="M13 5h-4m-4 0h-2" />
    <Path d="M3 9h6" />
    <Path d="M9 13h-6" />
    <Path d="M3 3l18 18" />
  </Svg>
);
export default SvgPlaylistOff;

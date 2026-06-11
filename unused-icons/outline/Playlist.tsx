import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgPlaylist = (props: SvgProps) => (
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
    <Path d="M11 17a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
    <Path d="M17 17v-13h4" />
    <Path d="M13 5h-10" />
    <Path d="M3 9l10 0" />
    <Path d="M9 13h-6" />
  </Svg>
);
export default SvgPlaylist;

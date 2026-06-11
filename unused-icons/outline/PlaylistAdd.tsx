import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgPlaylistAdd = (props: SvgProps) => (
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
    <Path d="M19 8h-14" />
    <Path d="M5 12h9" />
    <Path d="M11 16h-6" />
    <Path d="M15 16h6" />
    <Path d="M18 13v6" />
  </Svg>
);
export default SvgPlaylistAdd;

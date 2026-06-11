import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgMoodTongueWink = (props: SvgProps) => (
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
    <Path d="M12 21a9 9 0 1 1 0 -18a9 9 0 0 1 0 18" />
    <Path d="M3 12a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
    <Path d="M9 10h.01" />
    <Path d="M10 14v2a2 2 0 0 0 4 0v-2" />
    <Path d="M15.5 14h-7" />
    <Path d="M17 10c-.5 -1 -2.5 -1 -3 0" />
  </Svg>
);
export default SvgMoodTongueWink;

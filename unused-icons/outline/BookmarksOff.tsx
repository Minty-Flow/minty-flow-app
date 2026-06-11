import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgBookmarksOff = (props: SvgProps) => (
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
    <Path d="M11 7h2a2 2 0 0 1 2 2v2m0 4v6l-5 -3l-5 3v-12a2 2 0 0 1 2 -2" />
    <Path d="M9.265 4a2 2 0 0 1 1.735 -1h6a2 2 0 0 1 2 2v10" />
    <Path d="M3 3l18 18" />
  </Svg>
);
export default SvgBookmarksOff;

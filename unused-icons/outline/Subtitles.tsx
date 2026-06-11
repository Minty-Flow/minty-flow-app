import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgSubtitles = (props: SvgProps) => (
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
    <Path d="M18 5a3 3 0 0 1 3 3v8a3 3 0 0 1 -3 3h-12a3 3 0 0 1 -3 -3v-8a3 3 0 0 1 3 -3l12 0" />
    <Path d="M7 15h5" />
    <Path d="M15 15h2" />
    <Path d="M17 12h-3" />
    <Path d="M11 12h-1" />
  </Svg>
);
export default SvgSubtitles;

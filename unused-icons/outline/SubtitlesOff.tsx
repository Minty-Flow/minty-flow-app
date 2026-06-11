import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgSubtitlesOff = (props: SvgProps) => (
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
    <Path d="M9 5h9a3 3 0 0 1 3 3v8a3 3 0 0 1 -.13 .874m-2.006 2a3 3 0 0 1 -.864 .126h-12a3 3 0 0 1 -3 -3v-8c0 -1.35 .893 -2.493 2.12 -2.869" />
    <Path d="M7 15h5" />
    <Path d="M17 12h-1" />
    <Path d="M12 12h-2" />
    <Path d="M3 3l18 18" />
  </Svg>
);
export default SvgSubtitlesOff;

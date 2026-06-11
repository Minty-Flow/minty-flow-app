import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgMusicBolt = (props: SvgProps) => (
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
    <Path d="M3 17a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" />
    <Path d="M9 17v-13h10v8" />
    <Path d="M9 8h10" />
    <Path d="M19 16l-2 3h4l-2 3" />
  </Svg>
);
export default SvgMusicBolt;

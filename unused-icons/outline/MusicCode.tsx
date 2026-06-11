import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgMusicCode = (props: SvgProps) => (
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
    <Path d="M9 17v-13h10v9" />
    <Path d="M9 8h10" />
    <Path d="M20 21l2 -2l-2 -2" />
    <Path d="M17 17l-2 2l2 2" />
  </Svg>
);
export default SvgMusicCode;

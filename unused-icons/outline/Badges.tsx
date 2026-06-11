import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgBadges = (props: SvgProps) => (
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
    <Path d="M17 17v-4l-5 3l-5 -3v4l5 3l5 -3" />
    <Path d="M17 8v-4l-5 3l-5 -3v4l5 3l5 -3" />
  </Svg>
);
export default SvgBadges;

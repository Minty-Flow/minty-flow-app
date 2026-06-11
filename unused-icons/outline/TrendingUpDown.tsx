import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgTrendingUpDown = (props: SvgProps) => (
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
    <Path d="M2 14l6 -6l4 4l9 -9" />
    <Path d="M15 3h6v6" />
    <Path d="M15 21h6v-6" />
    <Path d="M21 21l-6 -6" />
  </Svg>
);
export default SvgTrendingUpDown;

import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgBuildingCircus = (props: SvgProps) => (
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
    <Path d="M4 11h16" />
    <Path d="M12 6.5c0 1 -5 4.5 -8 4.5" />
    <Path d="M12 6.5c0 1 5 4.5 8 4.5" />
    <Path d="M6 11c-.333 5.333 -1 8.667 -2 10h4c1 0 4 -4 4 -9v-1" />
    <Path d="M18 11c.333 5.333 1 8.667 2 10h-4c-1 0 -4 -4 -4 -9v-1" />
    <Path d="M12 7v-4l2 1h-2" />
  </Svg>
);
export default SvgBuildingCircus;

import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgRobotFace = (props: SvgProps) => (
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
    <Path d="M6 5h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2" />
    <Path d="M9 16c1 .667 2 1 3 1s2 -.333 3 -1" />
    <Path d="M9 7l-1 -4" />
    <Path d="M15 7l1 -4" />
    <Path d="M9 12v-1" />
    <Path d="M15 12v-1" />
  </Svg>
);
export default SvgRobotFace;

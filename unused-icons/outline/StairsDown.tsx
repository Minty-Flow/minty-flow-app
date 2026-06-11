import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgStairsDown = (props: SvgProps) => (
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
    <Path d="M22 21h-5v-5h-5v-5h-5v-5h-5" />
    <Path d="M18 3v7" />
    <Path d="M15 7l3 3l3 -3" />
  </Svg>
);
export default SvgStairsDown;

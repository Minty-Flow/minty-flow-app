import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgMilitaryRank = (props: SvgProps) => (
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
    <Path d="M18 7v12a2 2 0 0 1 -2 2h-8a2 2 0 0 1 -2 -2v-12l6 -4l6 4" />
    <Path d="M10 13l2 -1l2 1" />
    <Path d="M10 17l2 -1l2 1" />
    <Path d="M10 9l2 -1l2 1" />
  </Svg>
);
export default SvgMilitaryRank;

import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgBuildingStadium = (props: SvgProps) => (
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
    <Path d="M4 12a8 2 0 1 0 16 0a8 2 0 1 0 -16 0" />
    <Path d="M4 12v7c0 .94 2.51 1.785 6 2v-3h4v3c3.435 -.225 6 -1.07 6 -2v-7" />
    <Path d="M15 6h4v-3h-4v7" />
    <Path d="M7 6h4v-3h-4v7" />
  </Svg>
);
export default SvgBuildingStadium;

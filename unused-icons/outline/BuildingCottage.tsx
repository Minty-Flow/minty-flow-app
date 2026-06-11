import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgBuildingCottage = (props: SvgProps) => (
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
    <Path d="M3 21l18 0" />
    <Path d="M4 21v-11l2.5 -4.5l5.5 -2.5l5.5 2.5l2.5 4.5v11" />
    <Path d="M10 9a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
    <Path d="M9 21v-5a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v5" />
  </Svg>
);
export default SvgBuildingCottage;

import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgBuildingMonument = (props: SvgProps) => (
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
    <Path d="M8 18l2 -13l2 -2l2 2l2 13" />
    <Path d="M5 21v-3h14v3" />
    <Path d="M3 21l18 0" />
  </Svg>
);
export default SvgBuildingMonument;

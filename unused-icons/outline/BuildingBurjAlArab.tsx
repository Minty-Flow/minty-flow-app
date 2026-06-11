import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgBuildingBurjAlArab = (props: SvgProps) => (
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
    <Path d="M3 21h18" />
    <Path d="M7 21v-18" />
    <Path d="M7 4c5.675 .908 10 5.613 10 11.28a11 11 0 0 1 -1.605 5.72" />
    <Path d="M5 9h12" />
    <Path d="M7 13h4" />
    <Path d="M7 17h4" />
  </Svg>
);
export default SvgBuildingBurjAlArab;

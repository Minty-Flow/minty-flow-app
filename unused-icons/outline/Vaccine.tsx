import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgVaccine = (props: SvgProps) => (
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
    <Path d="M17 3l4 4" />
    <Path d="M19 5l-4.5 4.5" />
    <Path d="M11.5 6.5l6 6" />
    <Path d="M16.5 11.5l-6.5 6.5h-4v-4l6.5 -6.5" />
    <Path d="M7.5 12.5l1.5 1.5" />
    <Path d="M10.5 9.5l1.5 1.5" />
    <Path d="M3 21l3 -3" />
  </Svg>
);
export default SvgVaccine;

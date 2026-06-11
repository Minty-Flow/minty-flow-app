import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgBuildingSkyscraper = (props: SvgProps) => (
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
    <Path d="M5 21v-14l8 -4v18" />
    <Path d="M19 21v-10l-6 -4" />
    <Path d="M9 9l0 .01" />
    <Path d="M9 12l0 .01" />
    <Path d="M9 15l0 .01" />
    <Path d="M9 18l0 .01" />
  </Svg>
);
export default SvgBuildingSkyscraper;

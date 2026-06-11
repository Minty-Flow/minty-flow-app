import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgBrandLaravel = (props: SvgProps) => (
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
    <Path d="M3 17l8 5l7 -4v-8l-4 -2.5l4 -2.5l4 2.5v4l-11 6.5l-4 -2.5v-7.5l-4 -2.5l0 11.5" />
    <Path d="M11 18v4" />
    <Path d="M7 15.5l7 -4" />
    <Path d="M14 7.5v4" />
    <Path d="M14 11.5l4 2.5" />
    <Path d="M11 13v-7.5l-4 -2.5l-4 2.5" />
    <Path d="M7 8l4 -2.5" />
    <Path d="M18 10l4 -2.5" />
  </Svg>
);
export default SvgBrandLaravel;

import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgGymnastics = (props: SvgProps) => (
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
    <Path d="M7 7a1 1 0 1 0 2 0a1 1 0 0 0 -2 0" />
    <Path d="M13 21l1 -9l7 -6" />
    <Path d="M3 11h6l5 1" />
    <Path d="M11.5 8.5l4.5 -3.5" />
  </Svg>
);
export default SvgGymnastics;

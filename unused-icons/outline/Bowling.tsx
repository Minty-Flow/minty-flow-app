import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgBowling = (props: SvgProps) => (
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
    <Path d="M7 11v.01" />
    <Path d="M11 10v.01" />
    <Path d="M10 14v.01" />
    <Path d="M11.059 6.07a8 8 0 1 0 .32 15.81" />
    <Path d="M15.969 9h4" />
    <Path d="M14.969 5c0 1.5 1 2 1 4c0 2.5 -2 4.5 -2 7c0 2.6 1.9 6 1.9 6h4.1s2 -3.4 2 -6c0 -2.5 -2 -4.5 -2 -7c0 -2 1 -2.5 1 -4a3 3 0 1 0 -6 0" />
  </Svg>
);
export default SvgBowling;

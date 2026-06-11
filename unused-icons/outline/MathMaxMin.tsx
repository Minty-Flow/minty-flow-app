import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgMathMaxMin = (props: SvgProps) => (
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
    <Path d="M15 19a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" />
    <Path d="M5 5a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" />
    <Path d="M3 14s.605 -5.44 2.284 -7.862m3.395 .026c2.137 2.652 4.547 9.113 6.68 11.719" />
    <Path d="M18.748 18.038c.702 -.88 1.452 -3.56 2.252 -8.038" />
  </Svg>
);
export default SvgMathMaxMin;

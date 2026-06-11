import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgLassoPolygon = (props: SvgProps) => (
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
    <Path d="M4.028 13.252l-1.028 -3.252l2 -7l7 5l8 -3l1 9l-9 3l-5.144 -1.255" />
    <Path d="M3 15a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
    <Path d="M5 17c0 1.42 .316 2.805 1 4" />
  </Svg>
);
export default SvgLassoPolygon;

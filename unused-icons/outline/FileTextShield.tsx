import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgFileTextShield = (props: SvgProps) => (
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
    <Path d="M13 3v4a.997 .997 0 0 0 1 1h4" />
    <Path d="M11 21h-5a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v3.5" />
    <Path d="M8 9h1" />
    <Path d="M8 12.994l3 0" />
    <Path d="M8 16.997l2 0" />
    <Path d="M21 15.994c0 4 -2.5 6 -3.5 6s-3.5 -2 -3.5 -6c1 0 2.5 -.5 3.5 -1.5c1 1 2.5 1.5 3.5 1.5" />
  </Svg>
);
export default SvgFileTextShield;

import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgAbacusOff = (props: SvgProps) => (
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
    <Path d="M5 5v16" />
    <Path d="M19 21v-2m0 -4v-12" />
    <Path d="M5 7h2m4 0h8" />
    <Path d="M5 15h10" />
    <Path d="M8 13v4" />
    <Path d="M11 13v4" />
    <Path d="M16 16v1" />
    <Path d="M14 5v4" />
    <Path d="M11 5v2" />
    <Path d="M8 8v1" />
    <Path d="M3 21h18" />
    <Path d="M3 3l18 18" />
  </Svg>
);
export default SvgAbacusOff;

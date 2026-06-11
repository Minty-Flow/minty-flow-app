import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgAbacus = (props: SvgProps) => (
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
    <Path d="M5 3v18" />
    <Path d="M19 21v-18" />
    <Path d="M5 7h14" />
    <Path d="M5 15h14" />
    <Path d="M8 13v4" />
    <Path d="M11 13v4" />
    <Path d="M16 13v4" />
    <Path d="M14 5v4" />
    <Path d="M11 5v4" />
    <Path d="M8 5v4" />
    <Path d="M3 21h18" />
  </Svg>
);
export default SvgAbacus;

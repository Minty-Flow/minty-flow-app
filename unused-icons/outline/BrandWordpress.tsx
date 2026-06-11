import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgBrandWordpress = (props: SvgProps) => (
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
    <Path d="M9.5 9h3" />
    <Path d="M4 9h2.5" />
    <Path d="M11 9l3 11l4 -9" />
    <Path d="M5.5 9l3.5 11l3 -7" />
    <Path d="M18 11c.177 -.528 1 -1.364 1 -2.5c0 -1.78 -.776 -2.5 -1.875 -2.5c-.898 0 -1.125 .812 -1.125 1.429c0 1.83 2 2.058 2 3.571" />
    <Path d="M3 12a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
  </Svg>
);
export default SvgBrandWordpress;

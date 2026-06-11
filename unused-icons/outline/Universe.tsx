import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgUniverse = (props: SvgProps) => (
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
    <Path d="M7.027 11.477a5 5 0 1 0 5.496 -4.45a4.951 4.951 0 0 0 -3.088 .681" />
    <Path d="M5.636 5.636a9 9 0 1 0 3.555 -2.188" />
    <Path d="M17 5a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
    <Path d="M11 12a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
    <Path d="M8 16a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
  </Svg>
);
export default SvgUniverse;

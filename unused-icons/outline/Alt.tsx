import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgAlt = (props: SvgProps) => (
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
    <Path d="M4 16v-6a2 2 0 1 1 4 0v6" />
    <Path d="M4 13h4" />
    <Path d="M11 8v8h4" />
    <Path d="M16 8h4" />
    <Path d="M18 8v8" />
  </Svg>
);
export default SvgAlt;

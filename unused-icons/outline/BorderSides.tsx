import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgBorderSides = (props: SvgProps) => (
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
    <Path d="M4 8v8" />
    <Path d="M20 16v-8" />
    <Path d="M8 4h8" />
    <Path d="M8 20h8" />
  </Svg>
);
export default SvgBorderSides;

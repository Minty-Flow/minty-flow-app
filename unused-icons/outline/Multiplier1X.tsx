import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgMultiplier1X = (props: SvgProps) => (
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
    <Path d="M9 16v-8l-2 2" />
    <Path d="M13 16l4 -4" />
    <Path d="M17 16l-4 -4" />
  </Svg>
);
export default SvgMultiplier1X;

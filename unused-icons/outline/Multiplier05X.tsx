import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgMultiplier05X = (props: SvgProps) => (
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
    <Path d="M8 16h2a2 2 0 1 0 0 -4h-2v-4h4" />
    <Path d="M5 16v.01" />
    <Path d="M15 16l4 -4" />
    <Path d="M19 16l-4 -4" />
  </Svg>
);
export default SvgMultiplier05X;

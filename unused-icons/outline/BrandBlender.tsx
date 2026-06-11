import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgBrandBlender = (props: SvgProps) => (
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
    <Path d="M9 14a6 5 0 1 0 12 0a6 5 0 1 0 -12 0" />
    <Path d="M14 14a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
    <Path d="M3 16l9 -6.5" />
    <Path d="M6 9h9" />
    <Path d="M13 5l5.65 5" />
  </Svg>
);
export default SvgBrandBlender;

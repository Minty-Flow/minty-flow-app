import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgBrandWix = (props: SvgProps) => (
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
    <Path d="M3 9l1.5 6l1.379 -5.515a.64 .64 0 0 1 1.242 0l1.379 5.515l1.5 -6" />
    <Path d="M13 11.5v3.5" />
    <Path d="M16 9l5 6" />
    <Path d="M21 9l-5 6" />
    <Path d="M13 9h.01" />
  </Svg>
);
export default SvgBrandWix;

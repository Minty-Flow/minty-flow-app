import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgFilter2Minus = (props: SvgProps) => (
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
    <Path d="M4 6h16" />
    <Path d="M6 12h12" />
    <Path d="M9 18h3" />
    <Path d="M16 19h6" />
  </Svg>
);
export default SvgFilter2Minus;

import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgFilter2Discount = (props: SvgProps) => (
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
    <Path d="M16 16v.01" />
    <Path d="M16 21l5 -5" />
    <Path d="M21 21v.01" />
  </Svg>
);
export default SvgFilter2Discount;

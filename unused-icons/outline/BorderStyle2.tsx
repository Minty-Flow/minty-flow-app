import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgBorderStyle2 = (props: SvgProps) => (
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
    <Path d="M4 18v.01" />
    <Path d="M8 18v.01" />
    <Path d="M12 18v.01" />
    <Path d="M16 18v.01" />
    <Path d="M20 18v.01" />
    <Path d="M18 12h2" />
    <Path d="M11 12h2" />
    <Path d="M4 12h2" />
    <Path d="M4 6h16" />
  </Svg>
);
export default SvgBorderStyle2;

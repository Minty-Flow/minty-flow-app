import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgListTree = (props: SvgProps) => (
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
    <Path d="M9 6h11" />
    <Path d="M12 12h8" />
    <Path d="M15 18h5" />
    <Path d="M5 6v.01" />
    <Path d="M8 12v.01" />
    <Path d="M11 18v.01" />
  </Svg>
);
export default SvgListTree;

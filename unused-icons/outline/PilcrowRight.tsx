import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgPilcrowRight = (props: SvgProps) => (
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
    <Path d="M11 9h-2a3 3 0 1 1 0 -6h7" />
    <Path d="M11 3v11" />
    <Path d="M15 3v11" />
    <Path d="M21 18h-18" />
    <Path d="M18 15l3 3l-3 3" />
  </Svg>
);
export default SvgPilcrowRight;

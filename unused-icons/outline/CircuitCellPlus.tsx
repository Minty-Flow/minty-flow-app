import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgCircuitCellPlus = (props: SvgProps) => (
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
    <Path d="M2 12h9" />
    <Path d="M15 12h7" />
    <Path d="M11 5v14" />
    <Path d="M15 9v6" />
    <Path d="M3 5h4" />
    <Path d="M5 3v4" />
  </Svg>
);
export default SvgCircuitCellPlus;

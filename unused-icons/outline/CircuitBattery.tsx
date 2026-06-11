import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgCircuitBattery = (props: SvgProps) => (
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
    <Path d="M2 12h4" />
    <Path d="M18 12h4" />
    <Path d="M18 5v14" />
    <Path d="M14 9v6" />
    <Path d="M10 5v14" />
    <Path d="M6 9v6" />
  </Svg>
);
export default SvgCircuitBattery;

import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgCircuitCapacitor = (props: SvgProps) => (
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
    <Path d="M22 12h-8" />
    <Path d="M2 12h8" />
    <Path d="M10 7v10" />
    <Path d="M14 7v10" />
  </Svg>
);
export default SvgCircuitCapacitor;

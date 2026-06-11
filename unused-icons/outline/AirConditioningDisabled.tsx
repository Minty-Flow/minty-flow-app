import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgAirConditioningDisabled = (props: SvgProps) => (
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
    <Path d="M3 10a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v4a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2l0 -4" />
    <Path d="M7 16v-3a1 1 0 0 1 1 -1h8a1 1 0 0 1 1 1v3" />
  </Svg>
);
export default SvgAirConditioningDisabled;

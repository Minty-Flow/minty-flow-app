import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgCircuitAmmeter = (props: SvgProps) => (
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
    <Path d="M5 12a7 7 0 1 0 14 0a7 7 0 1 0 -14 0" />
    <Path d="M5 12h-3" />
    <Path d="M19 12h3" />
    <Path d="M10 14v-3c0 -1.036 .895 -2 2 -2s2 .964 2 2v3" />
    <Path d="M14 12h-4" />
  </Svg>
);
export default SvgCircuitAmmeter;

import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgCircuitBulb = (props: SvgProps) => (
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
    <Path d="M2 12h5" />
    <Path d="M17 12h5" />
    <Path d="M7 12a5 5 0 1 0 10 0a5 5 0 1 0 -10 0" />
    <Path d="M8.5 8.5l7 7" />
    <Path d="M15.5 8.5l-7 7" />
  </Svg>
);
export default SvgCircuitBulb;

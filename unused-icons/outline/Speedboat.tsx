import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgSpeedboat = (props: SvgProps) => (
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
    <Path d="M2 17h14.4a3 3 0 0 0 2.5 -1.34l3.1 -4.66h-6.23a4 4 0 0 0 -1.49 .29l-3.56 1.42a4 4 0 0 1 -1.49 .29h-5.73l-1.5 4" />
    <Path d="M6 13l1.5 -5" />
    <Path d="M6 8h8l2 3" />
  </Svg>
);
export default SvgSpeedboat;

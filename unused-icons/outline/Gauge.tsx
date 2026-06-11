import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgGauge = (props: SvgProps) => (
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
    <Path d="M3 12a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
    <Path d="M11 12a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
    <Path d="M13.41 10.59l2.59 -2.59" />
    <Path d="M7 12a5 5 0 0 1 5 -5" />
  </Svg>
);
export default SvgGauge;

import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgStrokeCurved = (props: SvgProps) => (
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
    <Path d="M4 19h1.341a7 7 0 0 0 6.845 -5.533l.628 -2.934a7 7 0 0 1 6.846 -5.533h1.34" />
  </Svg>
);
export default SvgStrokeCurved;

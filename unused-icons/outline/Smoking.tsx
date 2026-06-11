import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgSmoking = (props: SvgProps) => (
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
    <Path d="M3 14a1 1 0 0 1 1 -1h16a1 1 0 0 1 1 1v2a1 1 0 0 1 -1 1h-16a1 1 0 0 1 -1 -1l0 -2" />
    <Path d="M8 13l0 4" />
    <Path d="M16 5v.5a2 2 0 0 0 2 2a2 2 0 0 1 2 2v.5" />
  </Svg>
);
export default SvgSmoking;

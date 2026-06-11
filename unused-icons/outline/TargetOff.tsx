import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgTargetOff = (props: SvgProps) => (
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
    <Path d="M11.286 11.3a1 1 0 0 0 1.41 1.419" />
    <Path d="M8.44 8.49a5 5 0 0 0 7.098 7.044m1.377 -2.611a5 5 0 0 0 -5.846 -5.836" />
    <Path d="M5.649 5.623a9 9 0 1 0 12.698 12.758m1.683 -2.313a9 9 0 0 0 -12.076 -12.11" />
    <Path d="M3 3l18 18" />
  </Svg>
);
export default SvgTargetOff;

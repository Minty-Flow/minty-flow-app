import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgRipple = (props: SvgProps) => (
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
    <Path d="M3 7c3 -2 6 -2 9 0s6 2 9 0" />
    <Path d="M3 17c3 -2 6 -2 9 0s6 2 9 0" />
    <Path d="M3 12c3 -2 6 -2 9 0s6 2 9 0" />
  </Svg>
);
export default SvgRipple;

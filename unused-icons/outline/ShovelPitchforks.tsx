import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgShovelPitchforks = (props: SvgProps) => (
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
    <Path d="M5 3h4" />
    <Path d="M7 3v12" />
    <Path d="M4 15h6v3a3 3 0 0 1 -6 0v-3" />
    <Path d="M14 21v-3a3 3 0 0 1 6 0v3" />
    <Path d="M17 21v-18" />
  </Svg>
);
export default SvgShovelPitchforks;

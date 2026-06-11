import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgSwitch = (props: SvgProps) => (
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
    <Path d="M15 4l4 0l0 4" />
    <Path d="M14.75 9.25l4.25 -5.25" />
    <Path d="M5 19l4 -4" />
    <Path d="M15 19l4 0l0 -4" />
    <Path d="M5 5l14 14" />
  </Svg>
);
export default SvgSwitch;

import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgSwitchVertical = (props: SvgProps) => (
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
    <Path d="M3 8l4 -4l4 4" />
    <Path d="M7 4l0 9" />
    <Path d="M13 16l4 4l4 -4" />
    <Path d="M17 10l0 10" />
  </Svg>
);
export default SvgSwitchVertical;

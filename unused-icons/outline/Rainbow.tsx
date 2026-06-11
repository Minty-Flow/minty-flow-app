import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgRainbow = (props: SvgProps) => (
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
    <Path d="M22 17c0 -5.523 -4.477 -10 -10 -10c-5.523 0 -10 4.477 -10 10" />
    <Path d="M18 17a6 6 0 1 0 -12 0" />
    <Path d="M14 17a2 2 0 1 0 -4 0" />
  </Svg>
);
export default SvgRainbow;

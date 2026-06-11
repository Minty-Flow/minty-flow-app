import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgElevator = (props: SvgProps) => (
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
    <Path d="M5 5a1 1 0 0 1 1 -1h12a1 1 0 0 1 1 1v14a1 1 0 0 1 -1 1h-12a1 1 0 0 1 -1 -1l0 -14" />
    <Path d="M10 10l2 -2l2 2" />
    <Path d="M10 14l2 2l2 -2" />
  </Svg>
);
export default SvgElevator;

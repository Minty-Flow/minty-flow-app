import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgBike = (props: SvgProps) => (
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
    <Path d="M2 18a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
    <Path d="M16 18a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
    <Path d="M12 19l0 -4l-3 -3l5 -4l2 3l3 0" />
    <Path d="M16 5a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
  </Svg>
);
export default SvgBike;

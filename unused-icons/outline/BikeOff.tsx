import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgBikeOff = (props: SvgProps) => (
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
    <Path d="M16.437 16.44a3 3 0 0 0 4.123 4.123m1.44 -2.563a3 3 0 0 0 -3 -3" />
    <Path d="M12 19v-4l-3 -3l1.665 -1.332m2.215 -1.772l1.12 -.896l2 3h3" />
    <Path d="M16 5a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
    <Path d="M3 3l18 18" />
  </Svg>
);
export default SvgBikeOff;

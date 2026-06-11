import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgElevatorOff = (props: SvgProps) => (
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
    <Path d="M8 4h10a1 1 0 0 1 1 1v10m0 4a1 1 0 0 1 -1 1h-12a1 1 0 0 1 -1 -1v-14" />
    <Path d="M12 8l2 2" />
    <Path d="M10 14l2 2l2 -2" />
    <Path d="M3 3l18 18" />
  </Svg>
);
export default SvgElevatorOff;

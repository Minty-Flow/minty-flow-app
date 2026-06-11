import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgHistory = (props: SvgProps) => (
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
    <Path d="M12 8l0 4l2 2" />
    <Path d="M3.05 11a9 9 0 1 1 .5 4m-.5 5v-5h5" />
  </Svg>
);
export default SvgHistory;

import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgActivityHeartbeat = (props: SvgProps) => (
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
    <Path d="M3 12h4.5l1.5 -6l4 12l2 -9l1.5 3h4.5" />
  </Svg>
);
export default SvgActivityHeartbeat;

import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgSubtask = (props: SvgProps) => (
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
    <Path d="M6 9l6 0" />
    <Path d="M4 5l4 0" />
    <Path d="M6 5v11a1 1 0 0 0 1 1h5" />
    <Path d="M12 8a1 1 0 0 1 1 -1h6a1 1 0 0 1 1 1v2a1 1 0 0 1 -1 1h-6a1 1 0 0 1 -1 -1l0 -2" />
    <Path d="M12 16a1 1 0 0 1 1 -1h6a1 1 0 0 1 1 1v2a1 1 0 0 1 -1 1h-6a1 1 0 0 1 -1 -1l0 -2" />
  </Svg>
);
export default SvgSubtask;

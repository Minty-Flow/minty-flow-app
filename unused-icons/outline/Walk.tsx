import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgWalk = (props: SvgProps) => (
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
    <Path d="M12 4a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
    <Path d="M7 21l3 -4" />
    <Path d="M16 21l-2 -4l-3 -3l1 -6" />
    <Path d="M6 12l2 -3l4 -1l3 3l3 1" />
  </Svg>
);
export default SvgWalk;

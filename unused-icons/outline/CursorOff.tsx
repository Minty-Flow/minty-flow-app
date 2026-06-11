import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgCursorOff = (props: SvgProps) => (
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
    <Path d="M9 4a3 3 0 0 1 3 3v1m0 9a3 3 0 0 1 -3 3" />
    <Path d="M15 4a3 3 0 0 0 -3 3v1m0 4v5a3 3 0 0 0 3 3" />
    <Path d="M3 3l18 18" />
  </Svg>
);
export default SvgCursorOff;

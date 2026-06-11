import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgFloatCenter = (props: SvgProps) => (
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
    <Path d="M9 6a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v4a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1l0 -4" />
    <Path d="M4 7l1 0" />
    <Path d="M4 11l1 0" />
    <Path d="M19 7l1 0" />
    <Path d="M19 11l1 0" />
    <Path d="M4 15l16 0" />
    <Path d="M4 19l16 0" />
  </Svg>
);
export default SvgFloatCenter;

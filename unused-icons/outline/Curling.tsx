import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgCurling = (props: SvgProps) => (
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
    <Path d="M4 13a4 4 0 0 1 4 -4h8a4 4 0 0 1 4 4v2a4 4 0 0 1 -4 4h-8a4 4 0 0 1 -4 -4l0 -2" />
    <Path d="M4 14h16" />
    <Path d="M8 5h6a2 2 0 0 1 2 2v2" />
  </Svg>
);
export default SvgCurling;

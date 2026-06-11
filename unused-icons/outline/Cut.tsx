import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgCut = (props: SvgProps) => (
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
    <Path d="M4 17a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
    <Path d="M14 17a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
    <Path d="M9.15 14.85l8.85 -10.85" />
    <Path d="M6 4l8.85 10.85" />
  </Svg>
);
export default SvgCut;

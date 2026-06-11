import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgWallOff = (props: SvgProps) => (
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
    <Path d="M8 4h10a2 2 0 0 1 2 2v10m-.589 3.417c-.361 .36 -.86 .583 -1.411 .583h-12a2 2 0 0 1 -2 -2v-12c0 -.55 .222 -1.047 .58 -1.409" />
    <Path d="M4 8h4m4 0h8" />
    <Path d="M20 12h-4m-4 0h-8" />
    <Path d="M4 16h12" />
    <Path d="M9 4v1" />
    <Path d="M14 8v2" />
    <Path d="M8 12v4" />
    <Path d="M11 16v4" />
    <Path d="M3 3l18 18" />
  </Svg>
);
export default SvgWallOff;

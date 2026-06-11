import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgChessQueen = (props: SvgProps) => (
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
    <Path d="M16 16l2 -11l-4 4l-2 -5l-2 5l-4 -4l2 11" />
    <Path d="M8 16l-1.447 .724a1 1 0 0 0 -.553 .894v2.382h12v-2.382a1 1 0 0 0 -.553 -.894l-1.447 -.724h-8" />
    <Path d="M11 4a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
    <Path d="M5 5a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
    <Path d="M17 5a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
  </Svg>
);
export default SvgChessQueen;

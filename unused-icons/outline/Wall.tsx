import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgWall = (props: SvgProps) => (
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
    <Path d="M4 6a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2l0 -12" />
    <Path d="M4 8h16" />
    <Path d="M20 12h-16" />
    <Path d="M4 16h16" />
    <Path d="M9 4v4" />
    <Path d="M14 8v4" />
    <Path d="M8 12v4" />
    <Path d="M16 12v4" />
    <Path d="M11 16v4" />
  </Svg>
);
export default SvgWall;

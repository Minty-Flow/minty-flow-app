import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgGoGame = (props: SvgProps) => (
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
    <Path d="M4 6a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
    <Path d="M10 12a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
    <Path d="M4 18a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
    <Path d="M16 18a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
    <Path d="M3 12h7m4 0h7" />
    <Path d="M3 6h1m4 0h13" />
    <Path d="M3 18h1m4 0h8m4 0h1" />
    <Path d="M6 3v1m0 4v8m0 4v1" />
    <Path d="M12 3v7m0 4v7" />
    <Path d="M18 3v13m0 4v1" />
  </Svg>
);
export default SvgGoGame;

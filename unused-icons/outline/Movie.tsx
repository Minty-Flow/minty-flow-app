import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgMovie = (props: SvgProps) => (
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
    <Path d="M8 4l0 16" />
    <Path d="M16 4l0 16" />
    <Path d="M4 8l4 0" />
    <Path d="M4 16l4 0" />
    <Path d="M4 12l16 0" />
    <Path d="M16 8l4 0" />
    <Path d="M16 16l4 0" />
  </Svg>
);
export default SvgMovie;

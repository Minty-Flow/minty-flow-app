import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgZoomInArea = (props: SvgProps) => (
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
    <Path d="M15 13v4" />
    <Path d="M13 15h4" />
    <Path d="M10 15a5 5 0 1 0 10 0a5 5 0 1 0 -10 0" />
    <Path d="M22 22l-3 -3" />
    <Path d="M6 18h-1a2 2 0 0 1 -2 -2v-1" />
    <Path d="M3 11v-1" />
    <Path d="M3 6v-1a2 2 0 0 1 2 -2h1" />
    <Path d="M10 3h1" />
    <Path d="M15 3h1a2 2 0 0 1 2 2v1" />
  </Svg>
);
export default SvgZoomInArea;

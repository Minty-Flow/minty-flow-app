import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgRuler2 = (props: SvgProps) => (
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
    <Path d="M17 3l4 4l-14 14l-4 -4l14 -14" />
    <Path d="M16 7l-1.5 -1.5" />
    <Path d="M13 10l-1.5 -1.5" />
    <Path d="M10 13l-1.5 -1.5" />
    <Path d="M7 16l-1.5 -1.5" />
  </Svg>
);
export default SvgRuler2;

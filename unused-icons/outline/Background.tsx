import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgBackground = (props: SvgProps) => (
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
    <Path d="M4 8l4 -4" />
    <Path d="M14 4l-10 10" />
    <Path d="M4 20l16 -16" />
    <Path d="M20 10l-10 10" />
    <Path d="M20 16l-4 4" />
  </Svg>
);
export default SvgBackground;

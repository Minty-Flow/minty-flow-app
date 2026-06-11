import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgKeyboard = (props: SvgProps) => (
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
    <Path d="M2 8a2 2 0 0 1 2 -2h16a2 2 0 0 1 2 2v8a2 2 0 0 1 -2 2h-16a2 2 0 0 1 -2 -2l0 -8" />
    <Path d="M6 10l0 .01" />
    <Path d="M10 10l0 .01" />
    <Path d="M14 10l0 .01" />
    <Path d="M18 10l0 .01" />
    <Path d="M6 14l0 .01" />
    <Path d="M18 14l0 .01" />
    <Path d="M10 14l4 .01" />
  </Svg>
);
export default SvgKeyboard;

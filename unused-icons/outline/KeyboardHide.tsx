import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgKeyboardHide = (props: SvgProps) => (
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
    <Path d="M2 5a2 2 0 0 1 2 -2h16a2 2 0 0 1 2 2v8a2 2 0 0 1 -2 2h-16a2 2 0 0 1 -2 -2l0 -8" />
    <Path d="M6 7l0 .01" />
    <Path d="M10 7l0 .01" />
    <Path d="M14 7l0 .01" />
    <Path d="M18 7l0 .01" />
    <Path d="M6 11l0 .01" />
    <Path d="M18 11l0 .01" />
    <Path d="M10 11l4 0" />
    <Path d="M10 21l2 -2l2 2" />
  </Svg>
);
export default SvgKeyboardHide;

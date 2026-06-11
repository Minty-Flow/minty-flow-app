import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgLamp2 = (props: SvgProps) => (
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
    <Path d="M5 21h9" />
    <Path d="M10 21l-7 -8l8.5 -5.5" />
    <Path d="M13 14c-2.148 -2.148 -2.148 -5.852 0 -8c2.088 -2.088 5.842 -1.972 8 0l-8 8" />
    <Path d="M11.742 7.574l-1.156 -1.156a2 2 0 0 1 2.828 -2.829l1.144 1.144" />
    <Path d="M15.5 12l.208 .274a2.527 2.527 0 0 0 3.556 0c.939 -.933 .98 -2.42 .122 -3.4l-.366 -.369" />
  </Svg>
);
export default SvgLamp2;

import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgDragDrop = (props: SvgProps) => (
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
    <Path d="M19 11v-2a2 2 0 0 0 -2 -2h-8a2 2 0 0 0 -2 2v8a2 2 0 0 0 2 2h2" />
    <Path d="M13 13l9 3l-4 2l-2 4l-3 -9" />
    <Path d="M3 3l0 .01" />
    <Path d="M7 3l0 .01" />
    <Path d="M11 3l0 .01" />
    <Path d="M15 3l0 .01" />
    <Path d="M3 7l0 .01" />
    <Path d="M3 11l0 .01" />
    <Path d="M3 15l0 .01" />
  </Svg>
);
export default SvgDragDrop;

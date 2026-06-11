import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgDragDrop2 = (props: SvgProps) => (
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
    <Path d="M8 10a2 2 0 0 1 2 -2h8a2 2 0 0 1 2 2v8a2 2 0 0 1 -2 2h-8a2 2 0 0 1 -2 -2l0 -8" />
    <Path d="M4 4l0 .01" />
    <Path d="M8 4l0 .01" />
    <Path d="M12 4l0 .01" />
    <Path d="M16 4l0 .01" />
    <Path d="M4 8l0 .01" />
    <Path d="M4 12l0 .01" />
    <Path d="M4 16l0 .01" />
  </Svg>
);
export default SvgDragDrop2;

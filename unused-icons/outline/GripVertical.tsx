import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgGripVertical = (props: SvgProps) => (
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
    <Path d="M8 5a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
    <Path d="M8 12a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
    <Path d="M8 19a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
    <Path d="M14 5a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
    <Path d="M14 12a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
    <Path d="M14 19a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
  </Svg>
);
export default SvgGripVertical;

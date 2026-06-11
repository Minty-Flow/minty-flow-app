import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgArrowLoopLeft = (props: SvgProps) => (
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
    <Path d="M13 21v-13a4 4 0 1 1 4 4h-13" />
    <Path d="M8 16l-4 -4l4 -4" />
  </Svg>
);
export default SvgArrowLoopLeft;

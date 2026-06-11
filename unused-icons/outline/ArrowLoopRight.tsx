import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgArrowLoopRight = (props: SvgProps) => (
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
    <Path d="M12 21v-13a4 4 0 1 0 -4 4h13" />
    <Path d="M17 16l4 -4l-4 -4" />
  </Svg>
);
export default SvgArrowLoopRight;

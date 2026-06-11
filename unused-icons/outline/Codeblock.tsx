import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgCodeblock = (props: SvgProps) => (
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
    <Path d="M5 4l-2 2l2 2" />
    <Path d="M12 4l2 2l-2 2" />
    <Path d="M8 8l1 -4" />
    <Path d="M17 6a2 2 0 0 1 2 2v10a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2v-7" />
  </Svg>
);
export default SvgCodeblock;

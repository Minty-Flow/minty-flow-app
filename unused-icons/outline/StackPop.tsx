import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgStackPop = (props: SvgProps) => (
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
    <Path d="M7 9.5l-3 1.5l8 4l8 -4l-3 -1.5" />
    <Path d="M4 15l8 4l8 -4" />
    <Path d="M12 11v-7" />
    <Path d="M9 7l3 -3l3 3" />
  </Svg>
);
export default SvgStackPop;

import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgArrowDownSquare = (props: SvgProps) => (
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
    <Path d="M12 7v14" />
    <Path d="M9 18l3 3l3 -3" />
    <Path d="M14 3v4h-4v-4l4 0" />
  </Svg>
);
export default SvgArrowDownSquare;

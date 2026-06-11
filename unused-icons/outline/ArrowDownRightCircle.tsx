import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgArrowDownRightCircle = (props: SvgProps) => (
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
    <Path d="M8.464 8.464l9.536 9.536" />
    <Path d="M14 18h4v-4" />
    <Path d="M8.414 8.414a2 2 0 1 0 -2.828 -2.828a2 2 0 0 0 2.828 2.828" />
  </Svg>
);
export default SvgArrowDownRightCircle;

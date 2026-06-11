import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgArrowLeftRight = (props: SvgProps) => (
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
    <Path d="M17 13l4 -4l-4 -4" />
    <Path d="M7 13l-4 -4l4 -4" />
    <Path d="M12 14a5 5 0 0 1 5 -5h4" />
    <Path d="M12 19v-5a5 5 0 0 0 -5 -5h-4" />
  </Svg>
);
export default SvgArrowLeftRight;

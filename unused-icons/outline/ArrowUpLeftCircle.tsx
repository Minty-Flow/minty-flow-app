import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgArrowUpLeftCircle = (props: SvgProps) => (
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
    <Path d="M15.536 15.536l-9.536 -9.536" />
    <Path d="M10 6h-4v4" />
    <Path d="M15.586 15.586a2 2 0 1 0 2.828 2.828a2 2 0 0 0 -2.828 -2.828" />
  </Svg>
);
export default SvgArrowUpLeftCircle;

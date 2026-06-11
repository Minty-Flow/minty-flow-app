import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgArrowLeftTail = (props: SvgProps) => (
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
    <Path d="M18 12h-15" />
    <Path d="M6 9l-3 3l3 3" />
    <Path d="M21 9l-3 3l3 3" />
  </Svg>
);
export default SvgArrowLeftTail;

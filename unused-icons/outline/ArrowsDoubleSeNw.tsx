import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgArrowsDoubleSeNw = (props: SvgProps) => (
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
    <Path d="M3 10l11 11" />
    <Path d="M14 17v4h-4" />
    <Path d="M14 3h-4v4" />
    <Path d="M21 14l-11 -11" />
  </Svg>
);
export default SvgArrowsDoubleSeNw;

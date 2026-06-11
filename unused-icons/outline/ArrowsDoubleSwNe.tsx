import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgArrowsDoubleSwNe = (props: SvgProps) => (
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
    <Path d="M14 3l-11 11" />
    <Path d="M3 10v4h4" />
    <Path d="M17 10h4v4" />
    <Path d="M10 21l11 -11" />
  </Svg>
);
export default SvgArrowsDoubleSwNe;

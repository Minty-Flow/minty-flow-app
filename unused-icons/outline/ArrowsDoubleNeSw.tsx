import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgArrowsDoubleNeSw = (props: SvgProps) => (
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
    <Path d="M3 14l11 -11" />
    <Path d="M10 3h4v4" />
    <Path d="M10 17v4h4" />
    <Path d="M21 10l-11 11" />
  </Svg>
);
export default SvgArrowsDoubleNeSw;

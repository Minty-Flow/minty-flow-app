import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgMathXMinusX = (props: SvgProps) => (
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
    <Path d="M2 9l6 6" />
    <Path d="M2 15l6 -6" />
    <Path d="M16 9l6 6" />
    <Path d="M16 15l6 -6" />
    <Path d="M10 12h4" />
  </Svg>
);
export default SvgMathXMinusX;

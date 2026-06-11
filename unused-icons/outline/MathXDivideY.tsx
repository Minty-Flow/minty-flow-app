import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgMathXDivideY = (props: SvgProps) => (
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
    <Path d="M9 3l6 6" />
    <Path d="M9 9l6 -6" />
    <Path d="M9 15l3 4.5" />
    <Path d="M15 15l-4.5 7" />
    <Path d="M5 12h14" />
  </Svg>
);
export default SvgMathXDivideY;

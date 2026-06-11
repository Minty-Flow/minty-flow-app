import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgMathYMinusY = (props: SvgProps) => (
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
    <Path d="M2 9l3 5.063" />
    <Path d="M8 9l-4.8 9" />
    <Path d="M16 9l3 5.063" />
    <Path d="M22 9l-4.8 9" />
    <Path d="M10 12h4" />
  </Svg>
);
export default SvgMathYMinusY;

import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgMathXPlusY = (props: SvgProps) => (
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
    <Path d="M16 9l3 5.063" />
    <Path d="M2 9l6 6" />
    <Path d="M2 15l6 -6" />
    <Path d="M22 9l-4.8 9" />
    <Path d="M10 12h4" />
    <Path d="M12 10v4" />
  </Svg>
);
export default SvgMathXPlusY;

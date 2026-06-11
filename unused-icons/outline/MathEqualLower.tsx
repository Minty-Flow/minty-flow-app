import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgMathEqualLower = (props: SvgProps) => (
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
    <Path d="M19 18l-14 -4" />
    <Path d="M19 14l-14 -4l14 -4" />
  </Svg>
);
export default SvgMathEqualLower;

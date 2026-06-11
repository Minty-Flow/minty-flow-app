import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgMathGreater = (props: SvgProps) => (
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
    <Path d="M5 18l14 -6l-14 -6" />
  </Svg>
);
export default SvgMathGreater;

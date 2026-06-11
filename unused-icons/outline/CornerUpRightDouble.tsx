import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgCornerUpRightDouble = (props: SvgProps) => (
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
    <Path d="M4 18v-6a3 3 0 0 1 3 -3h7" />
    <Path d="M10 13l4 -4l-4 -4m5 8l4 -4l-4 -4" />
  </Svg>
);
export default SvgCornerUpRightDouble;

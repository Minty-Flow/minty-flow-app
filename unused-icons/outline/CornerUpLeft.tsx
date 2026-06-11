import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgCornerUpLeft = (props: SvgProps) => (
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
    <Path d="M18 18v-6a3 3 0 0 0 -3 -3h-10l4 -4m0 8l-4 -4" />
  </Svg>
);
export default SvgCornerUpLeft;

import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgCornerDownRight = (props: SvgProps) => (
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
    <Path d="M6 6v6a3 3 0 0 0 3 3h10l-4 -4m0 8l4 -4" />
  </Svg>
);
export default SvgCornerDownRight;

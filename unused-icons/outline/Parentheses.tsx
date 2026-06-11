import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgParentheses = (props: SvgProps) => (
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
    <Path d="M7 4a12.25 12.25 0 0 0 0 16" />
    <Path d="M17 4a12.25 12.25 0 0 1 0 16" />
  </Svg>
);
export default SvgParentheses;

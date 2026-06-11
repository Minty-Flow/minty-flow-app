import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgNeedle = (props: SvgProps) => (
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
    <Path d="M3 21c-.667 -.667 3.262 -6.236 11.785 -16.709a3.5 3.5 0 1 1 5.078 4.791c-10.575 8.612 -16.196 12.585 -16.863 11.918" />
    <Path d="M17.5 6.5l-1 1" />
  </Svg>
);
export default SvgNeedle;

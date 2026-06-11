import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgSpaces = (props: SvgProps) => (
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
    <Path d="M6.045 9.777a6 6 0 1 0 5.951 .023" />
    <Path d="M11.997 20.196a6 6 0 1 0 -2.948 -5.97" />
    <Path d="M17.95 9.785q .05 -.386 .05 -.785a6 6 0 1 0 -3.056 5.23" />
  </Svg>
);
export default SvgSpaces;

import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgBucket = (props: SvgProps) => (
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
    <Path d="M4 7a8 4 0 1 0 16 0a8 4 0 1 0 -16 0" />
    <Path d="M4 7c0 .664 .088 1.324 .263 1.965l2.737 10.035c.5 1.5 2.239 2 5 2s4.5 -.5 5 -2c.333 -1 1.246 -4.345 2.737 -10.035a7.45 7.45 0 0 0 .263 -1.965" />
  </Svg>
);
export default SvgBucket;

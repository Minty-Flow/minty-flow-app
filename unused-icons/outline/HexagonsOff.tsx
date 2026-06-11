import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgHexagonsOff = (props: SvgProps) => (
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
    <Path d="M4 18v-5l4 -2l4 2v5l-4 2l-4 -2" />
    <Path d="M8 11v-3m1.332 -2.666l2.668 -1.334l4 2v5" />
    <Path d="M12 13l.661 -.331" />
    <Path d="M15.345 11.328l.655 -.328l4 2v3m-1.334 2.667l-2.666 1.333l-4 -2" />
    <Path d="M3 3l18 18" />
  </Svg>
);
export default SvgHexagonsOff;

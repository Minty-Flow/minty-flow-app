import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgMapOff = (props: SvgProps) => (
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
    <Path d="M8.32 4.34l.68 -.34l6 3l6 -3v13m-2.67 1.335l-3.33 1.665l-6 -3l-6 3v-13l2.665 -1.333" />
    <Path d="M9 4v1m0 4v8" />
    <Path d="M15 7v4m0 4v5" />
    <Path d="M3 3l18 18" />
  </Svg>
);
export default SvgMapOff;

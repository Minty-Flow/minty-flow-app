import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgLocationCheck = (props: SvgProps) => (
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
    <Path d="M11.512 17.023l-1.512 -3.023l-7 -3.5a.55 .55 0 0 1 0 -1l18 -6.5l-4.45 12.324" />
    <Path d="M15 19l2 2l4 -4" />
  </Svg>
);
export default SvgLocationCheck;

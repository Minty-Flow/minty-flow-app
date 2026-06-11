import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgArcheryArrow = (props: SvgProps) => (
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
    <Path d="M14 7v3h3l3 -3h-3v-3l-3 3" />
    <Path d="M14 10l-9 9" />
    <Path d="M5 15v4h4" />
  </Svg>
);
export default SvgArcheryArrow;

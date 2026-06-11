import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgSignRight = (props: SvgProps) => (
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
    <Path d="M8 21h4" />
    <Path d="M10 21v-10" />
    <Path d="M10 6v-3" />
    <Path d="M6 6h10l2 2.5l-2 2.5h-10l0 -5" />
  </Svg>
);
export default SvgSignRight;

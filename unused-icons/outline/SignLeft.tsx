import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgSignLeft = (props: SvgProps) => (
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
    <Path d="M16 21h-4" />
    <Path d="M14 21v-10" />
    <Path d="M14 6v-3" />
    <Path d="M18 6h-10l-2 2.5l2 2.5h10l0 -5" />
  </Svg>
);
export default SvgSignLeft;

import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgTextDirectionLtr = (props: SvgProps) => (
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
    <Path d="M5 19h14" />
    <Path d="M17 21l2 -2l-2 -2" />
    <Path d="M16 4h-6.5a3.5 3.5 0 0 0 0 7h.5" />
    <Path d="M14 15v-11" />
    <Path d="M10 15v-11" />
  </Svg>
);
export default SvgTextDirectionLtr;

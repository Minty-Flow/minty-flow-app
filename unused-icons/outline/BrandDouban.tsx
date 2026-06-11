import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgBrandDouban = (props: SvgProps) => (
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
    <Path d="M4 20h16" />
    <Path d="M5 4h14" />
    <Path d="M8 8h8a2 2 0 0 1 2 2v2a2 2 0 0 1 -2 2h-8a2 2 0 0 1 -2 -2v-2a2 2 0 0 1 2 -2" />
    <Path d="M16 14l-2 6" />
    <Path d="M8 17l1 3" />
  </Svg>
);
export default SvgBrandDouban;

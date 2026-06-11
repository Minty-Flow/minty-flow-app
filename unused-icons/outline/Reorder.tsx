import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgReorder = (props: SvgProps) => (
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
    <Path d="M3 16a1 1 0 0 1 1 -1h2a1 1 0 0 1 1 1v2a1 1 0 0 1 -1 1h-2a1 1 0 0 1 -1 -1l0 -2" />
    <Path d="M10 16a1 1 0 0 1 1 -1h2a1 1 0 0 1 1 1v2a1 1 0 0 1 -1 1h-2a1 1 0 0 1 -1 -1l0 -2" />
    <Path d="M17 16a1 1 0 0 1 1 -1h2a1 1 0 0 1 1 1v2a1 1 0 0 1 -1 1h-2a1 1 0 0 1 -1 -1l0 -2" />
    <Path d="M5 11v-3a3 3 0 0 1 3 -3h8a3 3 0 0 1 3 3v3" />
    <Path d="M16.5 8.5l2.5 2.5l2.5 -2.5" />
  </Svg>
);
export default SvgReorder;

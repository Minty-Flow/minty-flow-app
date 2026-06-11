import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgViewportNarrow = (props: SvgProps) => (
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
    <Path d="M3 12h7l-3 -3" />
    <Path d="M7 15l3 -3" />
    <Path d="M21 12h-7l3 -3" />
    <Path d="M17 15l-3 -3" />
    <Path d="M9 6v-1a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v1" />
    <Path d="M9 18v1a2 2 0 0 0 2 2h2a2 2 0 0 0 2 -2v-1" />
  </Svg>
);
export default SvgViewportNarrow;

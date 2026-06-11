import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgViewportWide = (props: SvgProps) => (
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
    <Path d="M10 12h-7l3 -3" />
    <Path d="M6 15l-3 -3" />
    <Path d="M14 12h7l-3 -3" />
    <Path d="M18 15l3 -3" />
    <Path d="M3 6v-1a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v1" />
    <Path d="M3 18v1a2 2 0 0 0 2 2h14a2 2 0 0 0 2 -2v-1" />
  </Svg>
);
export default SvgViewportWide;

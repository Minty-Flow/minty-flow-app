import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgPlayCard9 = (props: SvgProps) => (
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
    <Path d="M19 5v14a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2" />
    <Path d="M8 6h.01" />
    <Path d="M16 18h.01" />
    <Path d="M10 15h3a1 1 0 0 0 1 -1v-4a1 1 0 0 0 -1 -1h-2a1 1 0 0 0 -1 1v1a1 1 0 0 0 1 1h3" />
  </Svg>
);
export default SvgPlayCard9;

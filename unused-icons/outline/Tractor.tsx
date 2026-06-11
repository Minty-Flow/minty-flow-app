import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgTractor = (props: SvgProps) => (
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
    <Path d="M3 15a4 4 0 1 0 8 0a4 4 0 1 0 -8 0" />
    <Path d="M7 15l0 .01" />
    <Path d="M17 17a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
    <Path d="M10.5 17l6.5 0" />
    <Path d="M20 15.2v-4.2a1 1 0 0 0 -1 -1h-6l-2 -5h-6v6.5" />
    <Path d="M18 5h-1a1 1 0 0 0 -1 1v4" />
  </Svg>
);
export default SvgTractor;

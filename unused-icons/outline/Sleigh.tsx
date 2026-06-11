import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgSleigh = (props: SvgProps) => (
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
    <Path d="M3 19h15a4 4 0 0 0 4 -4" />
    <Path d="M16 15h-9a4 4 0 0 1 -4 -4v-6l1.243 1.243a6 6 0 0 0 4.242 1.757h3.515v2a2 2 0 0 0 2 2h.5a1.5 1.5 0 0 0 1.5 -1.5a1.5 1.5 0 0 1 3 0v1.5a3 3 0 0 1 -3 3" />
    <Path d="M15 15v4" />
    <Path d="M7 15v4" />
  </Svg>
);
export default SvgSleigh;

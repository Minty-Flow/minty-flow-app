import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgBadge4K = (props: SvgProps) => (
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
    <Path d="M3 7a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v10a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-10" />
    <Path d="M7 9v2a1 1 0 0 0 1 1h1" />
    <Path d="M10 9v6" />
    <Path d="M14 9v6" />
    <Path d="M17 9l-2 3l2 3" />
    <Path d="M15 12h-1" />
  </Svg>
);
export default SvgBadge4K;

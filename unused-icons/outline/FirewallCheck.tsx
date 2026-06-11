import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgFirewallCheck = (props: SvgProps) => (
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
    <Path d="M9 3v18" />
    <Path d="M3 9h18" />
    <Path d="M3 15h10" />
    <Path d="M15 3v10" />
    <Path d="M11 21h-6a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v8" />
    <Path d="M15 19l2 2l4 -4" />
  </Svg>
);
export default SvgFirewallCheck;

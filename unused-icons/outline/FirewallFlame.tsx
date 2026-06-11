import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgFirewallFlame = (props: SvgProps) => (
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
    <Path d="M15.5 16q 2.5 1.5 2.5 -1v-2s4 1.06 4 5c0 1.664 -.649 3.338 -2 4v-.25c0 -.957 -1.053 -1.75 -2 -1.75s-2 .793 -2 1.75v.25c-1.351 -.662 -2 -2 -2 -3.5s1.5 -2.5 1.5 -2.5" />
    <Path d="M9 3v13" />
    <Path d="M3 9h18" />
    <Path d="M6 21h-1a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v4" />
    <Path d="M3 15h7" />
    <Path d="M15 3v7" />
  </Svg>
);
export default SvgFirewallFlame;

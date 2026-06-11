import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgUfo = (props: SvgProps) => (
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
    <Path d="M16.95 9.01c3.02 .739 5.05 2.123 5.05 3.714c0 2.367 -4.48 4.276 -10 4.276s-10 -1.909 -10 -4.276c0 -1.59 2.04 -2.985 5.07 -3.724" />
    <Path d="M7 9c0 1.105 2.239 2 5 2s5 -.895 5 -2v-.035c0 -2.742 -2.239 -4.965 -5 -4.965s-5 2.223 -5 4.965v.035" />
    <Path d="M15 17l2 3" />
    <Path d="M8.5 17l-1.5 3" />
    <Path d="M12 14h.01" />
    <Path d="M7 13h.01" />
    <Path d="M17 13h.01" />
  </Svg>
);
export default SvgUfo;

import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgTrafficConeOff = (props: SvgProps) => (
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
    <Path d="M4 20h16" />
    <Path d="M9.4 10h.6m4 0h.6" />
    <Path d="M7.8 15h7.2" />
    <Path d="M6 20l3.5 -10.5" />
    <Path d="M10.5 6.5l.5 -1.5h2l2 6m2 6l1 3" />
    <Path d="M3 3l18 18" />
  </Svg>
);
export default SvgTrafficConeOff;

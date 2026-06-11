import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgDiamondOff = (props: SvgProps) => (
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
    <Path d="M9 5h9l3 5l-3.308 3.697m-1.883 2.104l-3.309 3.699a.7 .7 0 0 1 -1 0l-8.5 -9.5l2.62 -4.368" />
    <Path d="M10 12l-2 -2.2l.6 -1" />
    <Path d="M3 3l18 18" />
  </Svg>
);
export default SvgDiamondOff;

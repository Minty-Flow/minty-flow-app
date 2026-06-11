import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgPlayCardOff = (props: SvgProps) => (
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
    <Path d="M7 3h10a2 2 0 0 1 2 2v10m0 4a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2v-14" />
    <Path d="M16 18h.01" />
    <Path d="M13.716 13.712l-1.716 2.288l-3 -4l1.29 -1.72" />
    <Path d="M3 3l18 18" />
  </Svg>
);
export default SvgPlayCardOff;

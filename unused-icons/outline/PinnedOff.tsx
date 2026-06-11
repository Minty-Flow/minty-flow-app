import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgPinnedOff = (props: SvgProps) => (
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
    <Path d="M3 3l18 18" />
    <Path d="M15 4.5l-3.249 3.249m-2.57 1.433l-2.181 .818l-1.5 1.5l7 7l1.5 -1.5l.82 -2.186m1.43 -2.563l3.25 -3.251" />
    <Path d="M9 15l-4.5 4.5" />
    <Path d="M14.5 4l5.5 5.5" />
  </Svg>
);
export default SvgPinnedOff;

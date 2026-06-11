import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgBadgeOff = (props: SvgProps) => (
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
    <Path d="M7 7v10l5 3l5 -3m0 -4v-9l-5 3l-2.496 -1.497" />
    <Path d="M3 3l18 18" />
  </Svg>
);
export default SvgBadgeOff;

import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgBongOff = (props: SvgProps) => (
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
    <Path d="M9 5v-2h4v6m1.5 1.5l2.5 -2.5l2 2l-2.5 2.5m-.5 3.505a5 5 0 1 1 -7 -4.589v-2.416" />
    <Path d="M8 3h6" />
    <Path d="M6.1 17h9.8" />
    <Path d="M3 3l18 18" />
  </Svg>
);
export default SvgBongOff;

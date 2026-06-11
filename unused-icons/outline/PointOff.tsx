import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgPointOff = (props: SvgProps) => (
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
    <Path d="M9.15 9.194a4 4 0 0 0 5.697 5.617m1.153 -2.811a4 4 0 0 0 -4 -4" />
    <Path d="M3 3l18 18" />
  </Svg>
);
export default SvgPointOff;

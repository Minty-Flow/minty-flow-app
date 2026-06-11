import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgSumOff = (props: SvgProps) => (
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
    <Path d="M18 18a1 1 0 0 1 -1 1h-11l6 -7m-3 -7h8a1 1 0 0 1 1 1v2" />
    <Path d="M3 3l18 18" />
  </Svg>
);
export default SvgSumOff;

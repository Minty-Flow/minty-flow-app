import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgCellSignal2 = (props: SvgProps) => (
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
    <Path d="M20 20h-15.269a.731 .731 0 0 1 -.517 -1.249l14.537 -14.537a.731 .731 0 0 1 1.249 .517v15.269" />
    <Path d="M8 20v-5" />
  </Svg>
);
export default SvgCellSignal2;

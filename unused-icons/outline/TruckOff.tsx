import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgTruckOff = (props: SvgProps) => (
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
    <Path d="M5 17a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
    <Path d="M15.585 15.586a2 2 0 0 0 2.826 2.831" />
    <Path d="M5 17h-2v-11a1 1 0 0 1 1 -1h1m3.96 0h4.04v4m0 4v4m-4 0h6m6 0v-6h-6m-2 -5h5l3 5" />
    <Path d="M3 3l18 18" />
  </Svg>
);
export default SvgTruckOff;

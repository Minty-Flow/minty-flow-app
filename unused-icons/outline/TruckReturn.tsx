import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgTruckReturn = (props: SvgProps) => (
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
    <Path d="M15 17a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
    <Path d="M5 17h-2v-11a1 1 0 0 1 1 -1h9v6h-5l2 2m0 -4l-2 2" />
    <Path d="M9 17l6 0" />
    <Path d="M13 6h5l3 5v6h-2" />
  </Svg>
);
export default SvgTruckReturn;

import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgCar = (props: SvgProps) => (
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
    <Path d="M5 17h-2v-6l2 -5h9l4 5h1a2 2 0 0 1 2 2v4h-2m-4 0h-6m-6 -6h15m-6 0v-5" />
  </Svg>
);
export default SvgCar;

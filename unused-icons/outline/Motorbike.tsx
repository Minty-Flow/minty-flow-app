import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgMotorbike = (props: SvgProps) => (
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
    <Path d="M2 16a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
    <Path d="M16 16a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
    <Path d="M7.5 14h5l4 -4h-10.5m1.5 4l4 -4" />
    <Path d="M13 6h2l1.5 3l2 4" />
  </Svg>
);
export default SvgMotorbike;

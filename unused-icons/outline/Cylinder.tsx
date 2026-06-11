import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgCylinder = (props: SvgProps) => (
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
    <Path d="M5 6a7 3 0 1 0 14 0a7 3 0 1 0 -14 0" />
    <Path d="M5 6v12c0 1.657 3.134 3 7 3s7 -1.343 7 -3v-12" />
  </Svg>
);
export default SvgCylinder;

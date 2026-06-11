import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgShipOff = (props: SvgProps) => (
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
    <Path d="M2 20a2.4 2.4 0 0 0 2 1a2.4 2.4 0 0 0 2 -1a2.4 2.4 0 0 1 2 -1a2.4 2.4 0 0 1 2 1a2.4 2.4 0 0 0 2 1a2.4 2.4 0 0 0 2 -1a2.4 2.4 0 0 1 2 -1a2.4 2.4 0 0 1 2 1a2.4 2.4 0 0 0 2 1a2.4 2.4 0 0 0 2 -1" />
    <Path d="M4 18l-1 -5h10m4 0h4l-1.334 2.668" />
    <Path d="M5 13v-6h2m4 0h2l4 6" />
    <Path d="M3 3l18 18" />
  </Svg>
);
export default SvgShipOff;

import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgBedFlat = (props: SvgProps) => (
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
    <Path d="M3 11a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
    <Path d="M10 13h11v-2a3 3 0 0 0 -3 -3h-8v5" />
    <Path d="M3 16h18" />
  </Svg>
);
export default SvgBedFlat;

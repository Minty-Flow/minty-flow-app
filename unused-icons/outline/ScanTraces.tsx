import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgScanTraces = (props: SvgProps) => (
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
    <Path d="M4 8v-2a2 2 0 0 1 2 -2h2" />
    <Path d="M4 16v2a2 2 0 0 0 2 2h2" />
    <Path d="M16 4h2a2 2 0 0 1 2 2v2" />
    <Path d="M16 20h2a2 2 0 0 0 2 -2v-2" />
    <Path d="M11 12h6" />
    <Path d="M8 8h5" />
    <Path d="M9 16h5" />
  </Svg>
);
export default SvgScanTraces;

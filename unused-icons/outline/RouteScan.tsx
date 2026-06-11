import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgRouteScan = (props: SvgProps) => (
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
    <Path d="M7 12v-3h3" />
    <Path d="M14 9h3v3" />
    <Path d="M7 9l4.414 4.414a2 2 0 0 1 .586 1.414v2.172" />
    <Path d="M17 9l-4.414 4.414a2 2 0 0 0 -.586 1.414v2.172" />
  </Svg>
);
export default SvgRouteScan;

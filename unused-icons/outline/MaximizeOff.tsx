import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgMaximizeOff = (props: SvgProps) => (
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
    <Path d="M4 8v-2c0 -.551 .223 -1.05 .584 -1.412" />
    <Path d="M4 16v2a2 2 0 0 0 2 2h2" />
    <Path d="M16 4h2a2 2 0 0 1 2 2v2" />
    <Path d="M16 20h2c.545 0 1.04 -.218 1.4 -.572" />
    <Path d="M3 3l18 18" />
  </Svg>
);
export default SvgMaximizeOff;

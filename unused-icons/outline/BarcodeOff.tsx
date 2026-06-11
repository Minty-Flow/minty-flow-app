import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgBarcodeOff = (props: SvgProps) => (
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
    <Path d="M4 7v-1c0 -.552 .224 -1.052 .586 -1.414" />
    <Path d="M4 17v1a2 2 0 0 0 2 2h2" />
    <Path d="M16 4h2a2 2 0 0 1 2 2v1" />
    <Path d="M16 20h2c.551 0 1.05 -.223 1.412 -.584" />
    <Path d="M5 11h1v2h-1l0 -2" />
    <Path d="M10 11v2" />
    <Path d="M15 11v.01" />
    <Path d="M19 11v2" />
    <Path d="M3 3l18 18" />
  </Svg>
);
export default SvgBarcodeOff;

import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgCaptureOff = (props: SvgProps) => (
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
    <Path d="M4 16v2a2 2 0 0 0 2 2h2" />
    <Path d="M16 4h2a2 2 0 0 1 2 2v2" />
    <Path d="M16 20h2c.554 0 1.055 -.225 1.417 -.589" />
    <Path d="M9.87 9.887a3 3 0 0 0 4.255 4.23m.58 -3.416a3.012 3.012 0 0 0 -1.4 -1.403" />
    <Path d="M4 8v-2c0 -.548 .22 -1.044 .577 -1.405" />
    <Path d="M3 3l18 18" />
  </Svg>
);
export default SvgCaptureOff;

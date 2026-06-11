import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgDna2Off = (props: SvgProps) => (
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
    <Path d="M17 3v1c-.007 2.46 -.91 4.554 -2.705 6.281m-2.295 1.719c-3.328 1.99 -5 4.662 -5.008 8.014v1" />
    <Path d="M17 21.014v-1c0 -1.44 -.315 -2.755 -.932 -3.944m-4.068 -4.07c-1.903 -1.138 -3.263 -2.485 -4.082 -4.068" />
    <Path d="M8 4h9" />
    <Path d="M7 20h10" />
    <Path d="M12 8h4" />
    <Path d="M8 16h8" />
    <Path d="M3 3l18 18" />
  </Svg>
);
export default SvgDna2Off;

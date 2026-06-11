import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgMicrophone2Off = (props: SvgProps) => (
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
    <Path d="M16.908 12.917a5 5 0 1 0 -5.827 -5.819" />
    <Path d="M10.116 10.125l-6.529 7.46a2 2 0 1 0 2.827 2.83l7.461 -6.529" />
    <Path d="M3 3l18 18" />
  </Svg>
);
export default SvgMicrophone2Off;

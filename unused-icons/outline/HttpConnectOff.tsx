import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgHttpConnectOff = (props: SvgProps) => (
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
    <Path d="M7 10a2 2 0 1 0 -4 0v4a2 2 0 1 0 4 0" />
    <Path d="M17 13v-5l4 8v-8" />
    <Path d="M14 14a2 2 0 1 1 -4 0v-4m2 -2a2 2 0 0 1 2 2" />
    <Path d="M3 3l18 18" />
  </Svg>
);
export default SvgHttpConnectOff;

import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgMobiledataOff = (props: SvgProps) => (
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
    <Path d="M16 12v-8" />
    <Path d="M8 20v-8" />
    <Path d="M13 7l3 -3l3 3" />
    <Path d="M5 17l3 3l3 -3" />
    <Path d="M3 3l18 18" />
  </Svg>
);
export default SvgMobiledataOff;

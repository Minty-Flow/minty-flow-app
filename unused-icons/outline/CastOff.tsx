import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgCastOff = (props: SvgProps) => (
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
    <Path d="M3 19h.01" />
    <Path d="M7 19a4 4 0 0 0 -4 -4" />
    <Path d="M11 19a8 8 0 0 0 -8 -8" />
    <Path d="M15 19h3a3 3 0 0 0 .875 -.13m2 -2a3 3 0 0 0 .128 -.868v-8a3 3 0 0 0 -3 -3h-9m-3.865 .136a3 3 0 0 0 -1.935 1.864" />
    <Path d="M3 3l18 18" />
  </Svg>
);
export default SvgCastOff;

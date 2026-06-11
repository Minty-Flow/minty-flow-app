import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgSkateboardOff = (props: SvgProps) => (
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
    <Path d="M5 15a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
    <Path d="M15 15a2 2 0 0 0 2 2m2 -2a2 2 0 0 0 -2 -2" />
    <Path d="M3 9c0 .552 .895 1 2 1h5m4 0h5c1.105 0 2 -.448 2 -1" />
    <Path d="M3 3l18 18" />
  </Svg>
);
export default SvgSkateboardOff;

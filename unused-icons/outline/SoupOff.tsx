import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgSoupOff = (props: SvgProps) => (
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
    <Path d="M3 19h16" />
    <Path d="M15 11h6c0 1.691 -.525 3.26 -1.42 4.552m-2.034 2.032a7.963 7.963 0 0 1 -4.546 1.416h-2a8 8 0 0 1 -8 -8h8" />
    <Path d="M12 5v3" />
    <Path d="M15 5v3" />
    <Path d="M3 3l18 18" />
  </Svg>
);
export default SvgSoupOff;

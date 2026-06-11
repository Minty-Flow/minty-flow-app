import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgLinkOff = (props: SvgProps) => (
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
    <Path d="M9 15l3 -3m2 -2l1 -1" />
    <Path d="M11 6l.463 -.536a5 5 0 0 1 7.071 7.072l-.534 .464" />
    <Path d="M3 3l18 18" />
    <Path d="M13 18l-.397 .534a5.068 5.068 0 0 1 -7.127 0a4.972 4.972 0 0 1 0 -7.071l.524 -.463" />
  </Svg>
);
export default SvgLinkOff;

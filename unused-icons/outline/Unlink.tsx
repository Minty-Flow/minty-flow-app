import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgUnlink = (props: SvgProps) => (
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
    <Path d="M17 22v-2" />
    <Path d="M9 15l6 -6" />
    <Path d="M11 6l.463 -.536a5 5 0 0 1 7.071 7.072l-.534 .464" />
    <Path d="M13 18l-.397 .534a5.068 5.068 0 0 1 -7.127 0a4.972 4.972 0 0 1 0 -7.071l.524 -.463" />
    <Path d="M20 17h2" />
    <Path d="M2 7h2" />
    <Path d="M7 2v2" />
  </Svg>
);
export default SvgUnlink;

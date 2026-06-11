import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgCredits = (props: SvgProps) => (
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
    <Path d="M3 14a6 2 0 1 0 12 0a6 2 0 1 0 -12 0" />
    <Path d="M3 14v5c0 1.105 2.686 2 6 2s6 -.895 6 -2v-5" />
    <Path d="M9 5a6 2 0 1 0 12 0a6 2 0 1 0 -12 0" />
    <Path d="M9 5v3" />
    <Path d="M18.365 11.656c1.59 -.36 2.635 -.966 2.635 -1.656v-5" />
  </Svg>
);
export default SvgCredits;

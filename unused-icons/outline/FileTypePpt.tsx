import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgFileTypePpt = (props: SvgProps) => (
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
    <Path d="M14 3v4a1 1 0 0 0 1 1h4" />
    <Path d="M14 3v4a1 1 0 0 0 1 1h4" />
    <Path d="M5 18h1.5a1.5 1.5 0 0 0 0 -3h-1.5v6" />
    <Path d="M11 18h1.5a1.5 1.5 0 0 0 0 -3h-1.5v6" />
    <Path d="M16.5 15h3" />
    <Path d="M18 15v6" />
    <Path d="M5 12v-7a2 2 0 0 1 2 -2h7l5 5v4" />
  </Svg>
);
export default SvgFileTypePpt;

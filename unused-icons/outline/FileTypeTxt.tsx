import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgFileTypeTxt = (props: SvgProps) => (
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
    <Path d="M16.5 15h3" />
    <Path d="M5 12v-7a2 2 0 0 1 2 -2h7l5 5v4" />
    <Path d="M4.5 15h3" />
    <Path d="M6 15v6" />
    <Path d="M18 15v6" />
    <Path d="M10 15l4 6" />
    <Path d="M10 21l4 -6" />
  </Svg>
);
export default SvgFileTypeTxt;

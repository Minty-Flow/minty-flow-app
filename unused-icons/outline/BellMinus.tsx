import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgBellMinus = (props: SvgProps) => (
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
    <Path d="M12.5 17h-8.5a4 4 0 0 0 2 -3v-3a7 7 0 0 1 4 -6a2 2 0 1 1 4 0a7 7 0 0 1 4 6v3c.047 .386 .149 .758 .3 1.107" />
    <Path d="M9 17v1a3 3 0 0 0 3.504 2.958" />
    <Path d="M16 19h6" />
  </Svg>
);
export default SvgBellMinus;

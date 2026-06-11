import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgRulerOff = (props: SvgProps) => (
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
    <Path d="M8 4h11a1 1 0 0 1 1 1v5a1 1 0 0 1 -1 1h-4m-3.713 .299a1 1 0 0 0 -.287 .701v7a1 1 0 0 1 -1 1h-5a1 1 0 0 1 -1 -1v-14c0 -.284 .118 -.54 .308 -.722" />
    <Path d="M4 8h2" />
    <Path d="M4 12h3" />
    <Path d="M4 16h2" />
    <Path d="M12 4v3" />
    <Path d="M16 4v2" />
    <Path d="M3 3l18 18" />
  </Svg>
);
export default SvgRulerOff;

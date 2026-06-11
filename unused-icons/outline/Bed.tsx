import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgBed = (props: SvgProps) => (
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
    <Path d="M5 9a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
    <Path d="M22 17v-3h-20" />
    <Path d="M2 8v9" />
    <Path d="M12 14h10v-2a3 3 0 0 0 -3 -3h-7v5" />
  </Svg>
);
export default SvgBed;

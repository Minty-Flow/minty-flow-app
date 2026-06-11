import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgGrill = (props: SvgProps) => (
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
    <Path d="M19 8h-14a6 6 0 0 0 6 6h2a6 6 0 0 0 6 -5.775l0 -.225" />
    <Path d="M17 20a2 2 0 1 1 0 -4a2 2 0 0 1 0 4" />
    <Path d="M15 14l1 2" />
    <Path d="M9 14l-3 6" />
    <Path d="M15 18h-8" />
    <Path d="M15 5v-1" />
    <Path d="M12 5v-1" />
    <Path d="M9 5v-1" />
  </Svg>
);
export default SvgGrill;

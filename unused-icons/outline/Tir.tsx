import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgTir = (props: SvgProps) => (
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
    <Path d="M3 17a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
    <Path d="M15 17a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
    <Path d="M7 18h8m4 0h2v-6a5 7 0 0 0 -5 -7h-1l1.5 7h4.5" />
    <Path d="M12 18v-13h3" />
    <Path d="M3 17l0 -5l9 0" />
  </Svg>
);
export default SvgTir;

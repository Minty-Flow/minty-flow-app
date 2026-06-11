import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgExchange = (props: SvgProps) => (
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
    <Path d="M3 18a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
    <Path d="M17 6a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
    <Path d="M19 8v5a5 5 0 0 1 -5 5h-3l3 -3m0 6l-3 -3" />
    <Path d="M5 16v-5a5 5 0 0 1 5 -5h3l-3 -3m0 6l3 -3" />
  </Svg>
);
export default SvgExchange;

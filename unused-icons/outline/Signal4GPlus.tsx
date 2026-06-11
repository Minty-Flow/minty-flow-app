import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgSignal4GPlus = (props: SvgProps) => (
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
    <Path d="M17 12h4" />
    <Path d="M3 8v3a1 1 0 0 0 1 1h3" />
    <Path d="M7 8v8" />
    <Path d="M19 10v4" />
    <Path d="M14 8h-2a2 2 0 0 0 -2 2v4a2 2 0 0 0 2 2h2v-4h-1" />
  </Svg>
);
export default SvgSignal4GPlus;

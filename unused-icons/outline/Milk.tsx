import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgMilk = (props: SvgProps) => (
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
    <Path d="M8 6h8v-2a1 1 0 0 0 -1 -1h-6a1 1 0 0 0 -1 1v2" />
    <Path d="M16 6l1.094 1.759a6 6 0 0 1 .906 3.17v8.071a2 2 0 0 1 -2 2h-8a2 2 0 0 1 -2 -2v-8.071a6 6 0 0 1 .906 -3.17l1.094 -1.759" />
    <Path d="M10 16a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
    <Path d="M10 10h4" />
  </Svg>
);
export default SvgMilk;

import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgUhd = (props: SvgProps) => (
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
    <Path d="M10 16v-8" />
    <Path d="M10 12h4" />
    <Path d="M14 8v8" />
    <Path d="M17 8v8h2a2 2 0 0 0 2 -2v-4a2 2 0 0 0 -2 -2l-2 0" />
    <Path d="M3 8v6a2 2 0 1 0 4 0v-6" />
  </Svg>
);
export default SvgUhd;

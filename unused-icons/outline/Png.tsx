import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgPng = (props: SvgProps) => (
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
    <Path d="M21 8h-2a2 2 0 0 0 -2 2v4a2 2 0 0 0 2 2h2v-4h-1" />
    <Path d="M3 16v-8h2a2 2 0 1 1 0 4h-2" />
    <Path d="M10 16v-8l4 8v-8" />
  </Svg>
);
export default SvgPng;

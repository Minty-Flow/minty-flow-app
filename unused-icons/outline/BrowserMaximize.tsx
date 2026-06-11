import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgBrowserMaximize = (props: SvgProps) => (
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
    <Path d="M4 8h8" />
    <Path d="M20 11.5v6.5a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2h6.5" />
    <Path d="M8 4v4" />
    <Path d="M16 8l5 -5" />
    <Path d="M21 7.5v-4.5h-4.5" />
  </Svg>
);
export default SvgBrowserMaximize;

import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgSpray = (props: SvgProps) => (
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
    <Path d="M4 12a2 2 0 0 1 2 -2h4a2 2 0 0 1 2 2v7a2 2 0 0 1 -2 2h-4a2 2 0 0 1 -2 -2l0 -7" />
    <Path d="M6 10v-4a1 1 0 0 1 1 -1h2a1 1 0 0 1 1 1v4" />
    <Path d="M15 7h.01" />
    <Path d="M18 9h.01" />
    <Path d="M18 5h.01" />
    <Path d="M21 3h.01" />
    <Path d="M21 7h.01" />
    <Path d="M21 11h.01" />
    <Path d="M10 7h1" />
  </Svg>
);
export default SvgSpray;

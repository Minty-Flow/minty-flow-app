import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgMinimize = (props: SvgProps) => (
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
    <Path d="M15 19v-2a2 2 0 0 1 2 -2h2" />
    <Path d="M15 5v2a2 2 0 0 0 2 2h2" />
    <Path d="M5 15h2a2 2 0 0 1 2 2v2" />
    <Path d="M5 9h2a2 2 0 0 0 2 -2v-2" />
  </Svg>
);
export default SvgMinimize;

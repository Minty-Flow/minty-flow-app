import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgTimeDuration60 = (props: SvgProps) => (
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
    <Path d="M14 10.5v3a1.5 1.5 0 0 0 3 0v-3a1.5 1.5 0 0 0 -3 0" />
    <Path d="M11 9h-2a1 1 0 0 0 -1 1v4a1 1 0 0 0 1 1h1a1 1 0 0 0 1 -1v-1a1 1 0 0 0 -1 -1h-2" />
    <Path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0" />
  </Svg>
);
export default SvgTimeDuration60;

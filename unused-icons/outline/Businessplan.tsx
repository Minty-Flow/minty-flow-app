import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgBusinessplan = (props: SvgProps) => (
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
    <Path d="M11 6a5 3 0 1 0 10 0a5 3 0 1 0 -10 0" />
    <Path d="M11 6v4c0 1.657 2.239 3 5 3s5 -1.343 5 -3v-4" />
    <Path d="M11 10v4c0 1.657 2.239 3 5 3s5 -1.343 5 -3v-4" />
    <Path d="M11 14v4c0 1.657 2.239 3 5 3s5 -1.343 5 -3v-4" />
    <Path d="M7 9h-2.5a1.5 1.5 0 0 0 0 3h1a1.5 1.5 0 0 1 0 3h-2.5" />
    <Path d="M5 15v1m0 -8v1" />
  </Svg>
);
export default SvgBusinessplan;

import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgSortAscendingLetters = (props: SvgProps) => (
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
    <Path d="M15 10v-5c0 -1.38 .62 -2 2 -2s2 .62 2 2v5m0 -3h-4" />
    <Path d="M19 21h-4l4 -7h-4" />
    <Path d="M4 15l3 3l3 -3" />
    <Path d="M7 6v12" />
  </Svg>
);
export default SvgSortAscendingLetters;

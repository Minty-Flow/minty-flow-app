import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgSortDescendingNumbers = (props: SvgProps) => (
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
    <Path d="M4 15l3 3l3 -3" />
    <Path d="M7 6v12" />
    <Path d="M17 14a2 2 0 0 1 2 2v3a2 2 0 1 1 -4 0v-3a2 2 0 0 1 2 -2" />
    <Path d="M15 5a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
    <Path d="M19 5v3a2 2 0 0 1 -2 2h-1.5" />
  </Svg>
);
export default SvgSortDescendingNumbers;

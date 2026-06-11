import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgTableRow = (props: SvgProps) => (
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
    <Path d="M3 5a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-14" />
    <Path d="M9 3l-6 6" />
    <Path d="M14 3l-7 7" />
    <Path d="M19 3l-7 7" />
    <Path d="M21 6l-4 4" />
    <Path d="M3 10h18" />
    <Path d="M10 10v11" />
  </Svg>
);
export default SvgTableRow;

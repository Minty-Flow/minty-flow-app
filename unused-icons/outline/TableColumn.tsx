import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgTableColumn = (props: SvgProps) => (
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
    <Path d="M10 10h11" />
    <Path d="M10 3v18" />
    <Path d="M9 3l-6 6" />
    <Path d="M10 7l-7 7" />
    <Path d="M10 12l-7 7" />
    <Path d="M10 17l-4 4" />
  </Svg>
);
export default SvgTableColumn;

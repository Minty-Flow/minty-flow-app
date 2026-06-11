import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgSortAscendingShapes = (props: SvgProps) => (
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
    <Path d="M14 5a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v4a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1v-4" />
    <Path d="M17 14l-3.5 6h7l-3.5 -6" />
  </Svg>
);
export default SvgSortAscendingShapes;

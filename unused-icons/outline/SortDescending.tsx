import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgSortDescending = (props: SvgProps) => (
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
    <Path d="M4 6l9 0" />
    <Path d="M4 12l7 0" />
    <Path d="M4 18l7 0" />
    <Path d="M15 15l3 3l3 -3" />
    <Path d="M18 6l0 12" />
  </Svg>
);
export default SvgSortDescending;

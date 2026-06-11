import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgArrowsSort = (props: SvgProps) => (
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
    <Path d="M3 9l4 -4l4 4m-4 -4v14" />
    <Path d="M21 15l-4 4l-4 -4m4 4v-14" />
  </Svg>
);
export default SvgArrowsSort;

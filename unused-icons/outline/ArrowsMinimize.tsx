import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgArrowsMinimize = (props: SvgProps) => (
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
    <Path d="M5 9l4 0l0 -4" />
    <Path d="M3 3l6 6" />
    <Path d="M5 15l4 0l0 4" />
    <Path d="M3 21l6 -6" />
    <Path d="M19 9l-4 0l0 -4" />
    <Path d="M15 9l6 -6" />
    <Path d="M19 15l-4 0l0 4" />
    <Path d="M15 15l6 6" />
  </Svg>
);
export default SvgArrowsMinimize;

import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgDimensions = (props: SvgProps) => (
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
    <Path d="M3 5h11" />
    <Path d="M12 7l2 -2l-2 -2" />
    <Path d="M5 3l-2 2l2 2" />
    <Path d="M19 10v11" />
    <Path d="M17 19l2 2l2 -2" />
    <Path d="M21 12l-2 -2l-2 2" />
    <Path d="M3 12a2 2 0 0 1 2 -2h7a2 2 0 0 1 2 2v7a2 2 0 0 1 -2 2h-7a2 2 0 0 1 -2 -2l0 -7" />
  </Svg>
);
export default SvgDimensions;

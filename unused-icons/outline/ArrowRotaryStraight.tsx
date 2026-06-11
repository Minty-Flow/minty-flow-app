import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgArrowRotaryStraight = (props: SvgProps) => (
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
    <Path d="M10 13a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
    <Path d="M13 16v5" />
    <Path d="M13 3v7" />
    <Path d="M9 7l4 -4l4 4" />
  </Svg>
);
export default SvgArrowRotaryStraight;

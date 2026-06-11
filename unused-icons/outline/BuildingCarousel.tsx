import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgBuildingCarousel = (props: SvgProps) => (
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
    <Path d="M6 12a6 6 0 1 0 12 0a6 6 0 1 0 -12 0" />
    <Path d="M3 8a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
    <Path d="M10 4a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
    <Path d="M17 8a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
    <Path d="M3 16a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
    <Path d="M17 16a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
    <Path d="M8 22l4 -10l4 10" />
  </Svg>
);
export default SvgBuildingCarousel;

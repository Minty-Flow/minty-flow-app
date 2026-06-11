import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgChartGridDots = (props: SvgProps) => (
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
    <Path d="M16 6a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
    <Path d="M4 12a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
    <Path d="M4 18a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
    <Path d="M16 18a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
    <Path d="M8 18h8" />
    <Path d="M18 20v1" />
    <Path d="M18 3v1" />
    <Path d="M6 20v1" />
    <Path d="M6 10v-7" />
    <Path d="M12 3v18" />
    <Path d="M18 8v8" />
    <Path d="M8 12h13" />
    <Path d="M21 6h-1" />
    <Path d="M16 6h-13" />
    <Path d="M3 12h1" />
    <Path d="M20 18h1" />
    <Path d="M3 18h1" />
    <Path d="M6 14v2" />
  </Svg>
);
export default SvgChartGridDots;

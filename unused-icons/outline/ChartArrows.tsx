import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgChartArrows = (props: SvgProps) => (
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
    <Path d="M3 18l14 0" />
    <Path d="M9 9l3 3l-3 3" />
    <Path d="M14 15l3 3l-3 3" />
    <Path d="M3 3l0 18" />
    <Path d="M3 12l9 0" />
    <Path d="M18 3l3 3l-3 3" />
    <Path d="M3 6l18 0" />
  </Svg>
);
export default SvgChartArrows;

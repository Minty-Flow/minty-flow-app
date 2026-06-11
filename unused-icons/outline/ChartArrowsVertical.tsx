import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgChartArrowsVertical = (props: SvgProps) => (
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
    <Path d="M18 21v-14" />
    <Path d="M9 15l3 -3l3 3" />
    <Path d="M15 10l3 -3l3 3" />
    <Path d="M3 21l18 0" />
    <Path d="M12 21l0 -9" />
    <Path d="M3 6l3 -3l3 3" />
    <Path d="M6 21v-18" />
  </Svg>
);
export default SvgChartArrowsVertical;

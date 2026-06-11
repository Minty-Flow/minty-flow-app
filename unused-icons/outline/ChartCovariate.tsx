import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgChartCovariate = (props: SvgProps) => (
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
    <Path d="M18 11h.009" />
    <Path d="M14 15h.009" />
    <Path d="M12 6h.009" />
    <Path d="M8 10h.009" />
    <Path d="M3 21l17 -17" />
    <Path d="M3 3v18h18" />
  </Svg>
);
export default SvgChartCovariate;

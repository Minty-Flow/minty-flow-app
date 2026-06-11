import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgChartScatter = (props: SvgProps) => (
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
    <Path d="M3 3v18h18" />
    <Path d="M8 15.015v.015" />
    <Path d="M16 16.015v.015" />
    <Path d="M8 7.03v.015" />
    <Path d="M12 11.03v.015" />
    <Path d="M19 11.03v.015" />
  </Svg>
);
export default SvgChartScatter;

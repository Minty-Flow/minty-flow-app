import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgChartScatter3D = (props: SvgProps) => (
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
    <Path d="M3 20l9 -7" />
    <Path d="M12 3v10l9 7" />
    <Path d="M17 12v.015" />
    <Path d="M17 4.015v.015" />
    <Path d="M21 8.015v.015" />
    <Path d="M12 19.015v.015" />
    <Path d="M3 12.015v.015" />
    <Path d="M7 8.015v.015" />
    <Path d="M3 4.015v.015" />
  </Svg>
);
export default SvgChartScatter3D;

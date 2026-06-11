import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgChartRadar = (props: SvgProps) => (
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
    <Path d="M12 3l9.5 7l-3.5 11h-12l-3.5 -11l9.5 -7" />
    <Path d="M12 7.5l5.5 4l-2.5 5.5h-6.5l-2 -5.5l5.5 -4" />
    <Path d="M2.5 10l9.5 3l9.5 -3" />
    <Path d="M12 3v10l6 8" />
    <Path d="M6 21l6 -8" />
  </Svg>
);
export default SvgChartRadar;

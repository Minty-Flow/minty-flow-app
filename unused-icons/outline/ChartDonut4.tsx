import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgChartDonut4 = (props: SvgProps) => (
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
    <Path d="M8.848 14.667l-3.348 2.833" />
    <Path d="M12 3v5m4 4h5" />
    <Path d="M3 12a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
    <Path d="M14.219 15.328l2.781 4.172" />
    <Path d="M8 12a4 4 0 1 0 8 0a4 4 0 1 0 -8 0" />
  </Svg>
);
export default SvgChartDonut4;

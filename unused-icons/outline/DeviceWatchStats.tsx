import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgDeviceWatchStats = (props: SvgProps) => (
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
    <Path d="M6 9a3 3 0 0 1 3 -3h6a3 3 0 0 1 3 3v6a3 3 0 0 1 -3 3h-6a3 3 0 0 1 -3 -3l0 -6" />
    <Path d="M9 18v3h6v-3" />
    <Path d="M9 6v-3h6v3" />
    <Path d="M9 14v-4" />
    <Path d="M12 14v-1" />
    <Path d="M15 14v-3" />
  </Svg>
);
export default SvgDeviceWatchStats;

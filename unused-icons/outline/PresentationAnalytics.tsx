import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgPresentationAnalytics = (props: SvgProps) => (
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
    <Path d="M9 12v-4" />
    <Path d="M15 12v-2" />
    <Path d="M12 12v-1" />
    <Path d="M3 4h18" />
    <Path d="M4 4v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-10" />
    <Path d="M12 16v4" />
    <Path d="M9 20h6" />
  </Svg>
);
export default SvgPresentationAnalytics;

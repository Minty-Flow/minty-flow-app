import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgRoadSign = (props: SvgProps) => (
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
    <Path d="M13.446 2.6l7.955 7.954a2.045 2.045 0 0 1 0 2.892l-7.955 7.955a2.045 2.045 0 0 1 -2.892 0l-7.955 -7.955a2.045 2.045 0 0 1 0 -2.892l7.955 -7.955a2.045 2.045 0 0 1 2.892 0" />
    <Path d="M9 14v-2c0 -.59 .414 -1 1 -1h5" />
    <Path d="M13 9l2 2l-2 2" />
  </Svg>
);
export default SvgRoadSign;

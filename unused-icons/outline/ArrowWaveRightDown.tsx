import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgArrowWaveRightDown = (props: SvgProps) => (
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
    <Path d="M17 14h4v-4" />
    <Path d="M3 12c.887 1.284 2.48 2.033 4 2c1.52 .033 3.113 -.716 4 -2s2.48 -2.033 4 -2c1.52 -.033 3 1 4 2l2 2" />
  </Svg>
);
export default SvgArrowWaveRightDown;

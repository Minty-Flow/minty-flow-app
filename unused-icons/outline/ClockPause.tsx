import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgClockPause = (props: SvgProps) => (
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
    <Path d="M20.942 13.018a9 9 0 1 0 -7.909 7.922" />
    <Path d="M12 7v5l2 2" />
    <Path d="M17 17v5" />
    <Path d="M21 17v5" />
  </Svg>
);
export default SvgClockPause;

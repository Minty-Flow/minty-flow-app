import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgSwipeUp = (props: SvgProps) => (
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
    <Path d="M8 16a4 4 0 1 0 8 0a4 4 0 1 0 -8 0" />
    <Path d="M12 12v-8" />
    <Path d="M9 7l3 -3l3 3" />
  </Svg>
);
export default SvgSwipeUp;

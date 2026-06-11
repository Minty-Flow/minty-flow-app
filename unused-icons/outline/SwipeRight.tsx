import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgSwipeRight = (props: SvgProps) => (
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
    <Path d="M4 12a4 4 0 1 1 8 0a4 4 0 0 1 -8 0" />
    <Path d="M12 12h8" />
    <Path d="M17 15l3 -3l-3 -3" />
  </Svg>
);
export default SvgSwipeRight;

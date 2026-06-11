import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgBallBasketball = (props: SvgProps) => (
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
    <Path d="M3 12a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
    <Path d="M5.65 5.65l12.7 12.7" />
    <Path d="M5.65 18.35l12.7 -12.7" />
    <Path d="M12 3a9 9 0 0 0 9 9" />
    <Path d="M3 12a9 9 0 0 1 9 9" />
  </Svg>
);
export default SvgBallBasketball;

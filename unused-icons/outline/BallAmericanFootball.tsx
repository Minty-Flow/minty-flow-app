import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgBallAmericanFootball = (props: SvgProps) => (
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
    <Path d="M15 9l-6 6" />
    <Path d="M10 12l2 2" />
    <Path d="M12 10l2 2" />
    <Path d="M8 21a5 5 0 0 0 -5 -5" />
    <Path d="M16 3c-7.18 0 -13 5.82 -13 13a5 5 0 0 0 5 5c7.18 0 13 -5.82 13 -13a5 5 0 0 0 -5 -5" />
    <Path d="M16 3a5 5 0 0 0 5 5" />
  </Svg>
);
export default SvgBallAmericanFootball;

import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgAirBalloon = (props: SvgProps) => (
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
    <Path d="M10 20a1 1 0 0 1 1 -1h2a1 1 0 0 1 1 1v1a1 1 0 0 1 -1 1h-2a1 1 0 0 1 -1 -1l0 -1" />
    <Path d="M12 16c3.314 0 6 -4.686 6 -8a6 6 0 1 0 -12 0c0 3.314 2.686 8 6 8" />
    <Path d="M10 9a2 7 0 1 0 4 0a2 7 0 1 0 -4 0" />
  </Svg>
);
export default SvgAirBalloon;

import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgBalloon = (props: SvgProps) => (
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
    <Path d="M14 8a2 2 0 0 0 -2 -2" />
    <Path d="M6 8a6 6 0 1 1 12 0c0 4.97 -2.686 9 -6 9s-6 -4.03 -6 -9" />
    <Path d="M12 17v1a2 2 0 0 1 -2 2h-3a2 2 0 0 0 -2 2" />
  </Svg>
);
export default SvgBalloon;

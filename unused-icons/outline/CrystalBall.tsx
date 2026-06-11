import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgCrystalBall = (props: SvgProps) => (
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
    <Path d="M6.73 17.018a8 8 0 1 1 10.54 0" />
    <Path d="M5 19a2 2 0 0 0 2 2h10a2 2 0 1 0 0 -4h-10a2 2 0 0 0 -2 2" />
    <Path d="M11 7a3 3 0 0 0 -3 3" />
  </Svg>
);
export default SvgCrystalBall;

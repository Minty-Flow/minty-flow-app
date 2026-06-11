import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgSquareRoundedMinus2 = (props: SvgProps) => (
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
    <Path d="M12.5 21c-.18 .002 -.314 0 -.5 0c-7.2 0 -9 -1.8 -9 -9s1.8 -9 9 -9s9 1.8 9 9c0 1.136 -.046 2.138 -.152 3.02" />
    <Path d="M16 19h6" />
  </Svg>
);
export default SvgSquareRoundedMinus2;

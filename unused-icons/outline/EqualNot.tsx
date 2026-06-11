import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgEqualNot = (props: SvgProps) => (
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
    <Path d="M5 10h14" />
    <Path d="M5 14h14" />
    <Path d="M5 19l14 -14" />
  </Svg>
);
export default SvgEqualNot;

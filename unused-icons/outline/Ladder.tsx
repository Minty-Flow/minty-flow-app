import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgLadder = (props: SvgProps) => (
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
    <Path d="M8 3v18" />
    <Path d="M16 3v18" />
    <Path d="M8 14h8" />
    <Path d="M8 10h8" />
    <Path d="M8 6h8" />
    <Path d="M8 18h8" />
  </Svg>
);
export default SvgLadder;

import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgBracketsOff = (props: SvgProps) => (
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
    <Path d="M5 5v15h3" />
    <Path d="M16 4h3v11m0 4v1h-3" />
    <Path d="M3 3l18 18" />
  </Svg>
);
export default SvgBracketsOff;

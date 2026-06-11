import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgBracketsContainEnd = (props: SvgProps) => (
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
    <Path d="M14 4h4v16h-4" />
    <Path d="M5 16h.01" />
    <Path d="M9 16h.01" />
    <Path d="M13 16h.01" />
  </Svg>
);
export default SvgBracketsContainEnd;

import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgBracketsContainStart = (props: SvgProps) => (
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
    <Path d="M9 4h-4v16h4" />
    <Path d="M18 16h-.01" />
    <Path d="M14 16h-.01" />
    <Path d="M10 16h-.01" />
  </Svg>
);
export default SvgBracketsContainStart;

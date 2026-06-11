import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgBracketsContain = (props: SvgProps) => (
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
    <Path d="M7 4h-4v16h4" />
    <Path d="M17 4h4v16h-4" />
    <Path d="M8 16h.01" />
    <Path d="M12 16h.01" />
    <Path d="M16 16h.01" />
  </Svg>
);
export default SvgBracketsContain;

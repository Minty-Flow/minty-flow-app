import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgStairs = (props: SvgProps) => (
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
    <Path d="M22 5h-5v5h-5v5h-5v5h-5" />
  </Svg>
);
export default SvgStairs;

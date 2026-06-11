import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgInputCheck = (props: SvgProps) => (
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
    <Path d="M20 13v-4a2 2 0 0 0 -2 -2h-12a2 2 0 0 0 -2 2v5a2 2 0 0 0 2 2h6" />
    <Path d="M15 19l2 2l4 -4" />
  </Svg>
);
export default SvgInputCheck;

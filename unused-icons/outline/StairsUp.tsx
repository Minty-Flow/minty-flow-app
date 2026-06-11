import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgStairsUp = (props: SvgProps) => (
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
    <Path d="M22 6h-5v5h-5v5h-5v5h-5" />
    <Path d="M6 10v-7" />
    <Path d="M3 6l3 -3l3 3" />
  </Svg>
);
export default SvgStairsUp;

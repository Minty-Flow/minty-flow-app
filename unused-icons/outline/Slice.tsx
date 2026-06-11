import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgSlice = (props: SvgProps) => (
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
    <Path d="M3 19l15 -15l3 3l-6 6l2 2a14 14 0 0 1 -14 4" />
  </Svg>
);
export default SvgSlice;

import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgArrowUpToArc = (props: SvgProps) => (
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
    <Path d="M12 21v-12" />
    <Path d="M8 13l4 -4l4 4" />
    <Path d="M21 12a9 9 0 0 0 -18 0" />
  </Svg>
);
export default SvgArrowUpToArc;

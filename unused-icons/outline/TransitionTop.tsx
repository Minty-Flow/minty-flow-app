import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgTransitionTop = (props: SvgProps) => (
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
    <Path d="M21 6a3 3 0 0 0 -3 -3h-12a3 3 0 0 0 -3 3" />
    <Path d="M6 21h12a3 3 0 0 0 0 -6h-12a3 3 0 0 0 0 6" />
    <Path d="M12 15v-8" />
    <Path d="M9 10l3 -3l3 3" />
  </Svg>
);
export default SvgTransitionTop;

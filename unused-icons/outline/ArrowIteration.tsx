import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgArrowIteration = (props: SvgProps) => (
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
    <Path d="M8.5 16a5.5 5.5 0 1 0 -5.5 -5.5v.5" />
    <Path d="M3 16h18" />
    <Path d="M18 13l3 3l-3 3" />
  </Svg>
);
export default SvgArrowIteration;

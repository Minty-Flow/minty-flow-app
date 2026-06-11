import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgTransitionBottom = (props: SvgProps) => (
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
    <Path d="M21 18a3 3 0 0 1 -3 3h-12a3 3 0 0 1 -3 -3" />
    <Path d="M3 6a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3a3 3 0 0 1 -3 3h-12a3 3 0 0 1 -3 -3" />
    <Path d="M12 9v8" />
    <Path d="M9 14l3 3l3 -3" />
  </Svg>
);
export default SvgTransitionBottom;

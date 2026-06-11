import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgTransitionLeft = (props: SvgProps) => (
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
    <Path d="M6 21a3 3 0 0 1 -3 -3v-12a3 3 0 0 1 3 -3" />
    <Path d="M21 6v12a3 3 0 0 1 -6 0v-12a3 3 0 0 1 6 0" />
    <Path d="M15 12h-8" />
    <Path d="M10 9l-3 3l3 3" />
  </Svg>
);
export default SvgTransitionLeft;

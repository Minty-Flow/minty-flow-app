import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgSquareToggle = (props: SvgProps) => (
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
    <Path d="M12 2l0 20" />
    <Path d="M14 20h-8a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2h8" />
    <Path d="M20 6a2 2 0 0 0 -2 -2" />
    <Path d="M18 20a2 2 0 0 0 2 -2" />
    <Path d="M20 10l0 4" />
  </Svg>
);
export default SvgSquareToggle;

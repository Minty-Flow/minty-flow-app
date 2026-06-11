import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgEaseInOutControlPoints = (props: SvgProps) => (
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
    <Path d="M17 20a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" />
    <Path d="M17 20h-2" />
    <Path d="M7 4a2 2 0 1 1 -4 0a2 2 0 0 1 4 0" />
    <Path d="M7 4h2" />
    <Path d="M14 4h-2" />
    <Path d="M12 20h-2" />
    <Path d="M3 20c8 0 10 -16 18 -16" />
  </Svg>
);
export default SvgEaseInOutControlPoints;

import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgAdjustmentsAlt = (props: SvgProps) => (
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
    <Path d="M4 8h4v4h-4l0 -4" />
    <Path d="M6 4l0 4" />
    <Path d="M6 12l0 8" />
    <Path d="M10 14h4v4h-4l0 -4" />
    <Path d="M12 4l0 10" />
    <Path d="M12 18l0 2" />
    <Path d="M16 5h4v4h-4l0 -4" />
    <Path d="M18 4l0 1" />
    <Path d="M18 9l0 11" />
  </Svg>
);
export default SvgAdjustmentsAlt;

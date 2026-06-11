import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgPin = (props: SvgProps) => (
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
    <Path d="M15 4.5l-4 4l-4 1.5l-1.5 1.5l7 7l1.5 -1.5l1.5 -4l4 -4" />
    <Path d="M9 15l-4.5 4.5" />
    <Path d="M14.5 4l5.5 5.5" />
  </Svg>
);
export default SvgPin;

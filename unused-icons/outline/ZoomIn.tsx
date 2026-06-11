import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgZoomIn = (props: SvgProps) => (
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
    <Path d="M3 10a7 7 0 1 0 14 0a7 7 0 1 0 -14 0" />
    <Path d="M7 10l6 0" />
    <Path d="M10 7l0 6" />
    <Path d="M21 21l-6 -6" />
  </Svg>
);
export default SvgZoomIn;

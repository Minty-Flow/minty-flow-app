import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgHierarchy2 = (props: SvgProps) => (
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
    <Path d="M10 3h4v4h-4l0 -4" />
    <Path d="M3 17h4v4h-4l0 -4" />
    <Path d="M17 17h4v4h-4l0 -4" />
    <Path d="M7 17l5 -4l5 4" />
    <Path d="M12 7l0 6" />
  </Svg>
);
export default SvgHierarchy2;

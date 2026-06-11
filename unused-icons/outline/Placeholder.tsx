import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgPlaceholder = (props: SvgProps) => (
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
    <Path d="M10 20.415a8 8 0 1 0 3 -15.415h-3" />
    <Path d="M13 8l-3 -3l3 -3" />
    <Path d="M7 17l4 -4l-4 -4l-4 4l4 4" />
  </Svg>
);
export default SvgPlaceholder;

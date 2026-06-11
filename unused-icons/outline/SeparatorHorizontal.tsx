import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgSeparatorHorizontal = (props: SvgProps) => (
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
    <Path d="M4 12l16 0" />
    <Path d="M8 8l4 -4l4 4" />
    <Path d="M16 16l-4 4l-4 -4" />
  </Svg>
);
export default SvgSeparatorHorizontal;

import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgArrowsLeftDown = (props: SvgProps) => (
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
    <Path d="M7 3l-4 4l4 4" />
    <Path d="M3 7h11a3 3 0 0 1 3 3v11" />
    <Path d="M13 17l4 4l4 -4" />
  </Svg>
);
export default SvgArrowsLeftDown;

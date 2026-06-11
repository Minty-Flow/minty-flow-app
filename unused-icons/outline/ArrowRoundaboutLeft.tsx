import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgArrowRoundaboutLeft = (props: SvgProps) => (
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
    <Path d="M3 9h8a5 5 0 1 1 5 5v7" />
    <Path d="M7 5l-4 4l4 4" />
  </Svg>
);
export default SvgArrowRoundaboutLeft;

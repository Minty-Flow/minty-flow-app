import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgArrowRightSquare = (props: SvgProps) => (
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
    <Path d="M7 12l14 0" />
    <Path d="M18 15l3 -3l-3 -3" />
    <Path d="M3 10h4v4h-4l0 -4" />
  </Svg>
);
export default SvgArrowRightSquare;

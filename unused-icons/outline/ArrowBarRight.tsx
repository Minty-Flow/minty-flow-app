import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgArrowBarRight = (props: SvgProps) => (
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
    <Path d="M20 12l-10 0" />
    <Path d="M20 12l-4 4" />
    <Path d="M20 12l-4 -4" />
    <Path d="M4 4l0 16" />
  </Svg>
);
export default SvgArrowBarRight;

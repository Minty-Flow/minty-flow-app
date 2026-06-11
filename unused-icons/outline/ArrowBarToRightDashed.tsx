import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgArrowBarToRightDashed = (props: SvgProps) => (
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
    <Path d="M14 12l-10 0" />
    <Path d="M14 12l-4 4" />
    <Path d="M14 12l-4 -4" />
    <Path d="M20 4l0 3m0 13l0 -3m0 -3.5l0 -3" />
  </Svg>
);
export default SvgArrowBarToRightDashed;

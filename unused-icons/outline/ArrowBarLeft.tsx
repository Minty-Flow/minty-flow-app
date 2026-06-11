import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgArrowBarLeft = (props: SvgProps) => (
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
    <Path d="M4 12l10 0" />
    <Path d="M4 12l4 4" />
    <Path d="M4 12l4 -4" />
    <Path d="M20 4l0 16" />
  </Svg>
);
export default SvgArrowBarLeft;

import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgTextWrap = (props: SvgProps) => (
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
    <Path d="M4 6l16 0" />
    <Path d="M4 18l5 0" />
    <Path d="M4 12h13a3 3 0 0 1 0 6h-4l2 -2m0 4l-2 -2" />
  </Svg>
);
export default SvgTextWrap;

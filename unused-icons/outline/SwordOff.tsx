import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgSwordOff = (props: SvgProps) => (
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
    <Path d="M11.938 7.937l3.062 -3.937h5v5l-3.928 3.055m-2.259 1.757l-2.813 2.188l-4 4l-3 -3l4 -4l2.19 -2.815" />
    <Path d="M6.5 11.5l6 6" />
    <Path d="M3 3l18 18" />
  </Svg>
);
export default SvgSwordOff;

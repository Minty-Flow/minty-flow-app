import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgArrowsDown = (props: SvgProps) => (
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
    <Path d="M7 21l0 -18" />
    <Path d="M20 18l-3 3l-3 -3" />
    <Path d="M4 18l3 3l3 -3" />
    <Path d="M17 21l0 -18" />
  </Svg>
);
export default SvgArrowsDown;

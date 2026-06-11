import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgSTurnLeft = (props: SvgProps) => (
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
    <Path d="M19 7a2 2 0 1 1 0 -4a2 2 0 0 1 0 4" />
    <Path d="M17 5h-9.5a3.5 3.5 0 0 0 0 7h9a3.5 3.5 0 0 1 0 7h-13.5" />
    <Path d="M6 16l-3 3l3 3" />
  </Svg>
);
export default SvgSTurnLeft;

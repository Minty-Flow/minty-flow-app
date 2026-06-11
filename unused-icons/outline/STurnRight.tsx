import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgSTurnRight = (props: SvgProps) => (
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
    <Path d="M3 5a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
    <Path d="M7 5h9.5a3.5 3.5 0 0 1 0 7h-9a3.5 3.5 0 0 0 0 7h13.5" />
    <Path d="M18 16l3 3l-3 3" />
  </Svg>
);
export default SvgSTurnRight;

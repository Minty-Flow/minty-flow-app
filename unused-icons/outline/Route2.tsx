import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgRoute2 = (props: SvgProps) => (
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
    <Path d="M3 19a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" />
    <Path d="M19 7a2 2 0 1 0 0 -4a2 2 0 0 0 0 4" />
    <Path d="M14 5a2 2 0 0 0 -2 2v10a2 2 0 0 1 -2 2" />
  </Svg>
);
export default SvgRoute2;

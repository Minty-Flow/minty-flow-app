import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgLollipop = (props: SvgProps) => (
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
    <Path d="M7 10a7 7 0 1 0 14 0a7 7 0 1 0 -14 0" />
    <Path d="M21 10a3.5 3.5 0 0 0 -7 0" />
    <Path d="M14 10a3.5 3.5 0 0 1 -7 0" />
    <Path d="M14 17a3.5 3.5 0 0 0 0 -7" />
    <Path d="M14 3a3.5 3.5 0 0 0 0 7" />
    <Path d="M3 21l6 -6" />
  </Svg>
);
export default SvgLollipop;

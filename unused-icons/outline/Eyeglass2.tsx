import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgEyeglass2 = (props: SvgProps) => (
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
    <Path d="M8 4h-2l-3 10v2.5" />
    <Path d="M16 4h2l3 10v2.5" />
    <Path d="M10 16l4 0" />
    <Path d="M14 16.5a3.5 3.5 0 1 0 7 0a3.5 3.5 0 1 0 -7 0" />
    <Path d="M3 16.5a3.5 3.5 0 1 0 7 0a3.5 3.5 0 1 0 -7 0" />
  </Svg>
);
export default SvgEyeglass2;

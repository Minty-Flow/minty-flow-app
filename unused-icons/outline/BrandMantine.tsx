import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgBrandMantine = (props: SvgProps) => (
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
    <Path d="M3 12a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
    <Path d="M11 16c1.22 -.912 2 -2.36 2 -4a5.01 5.01 0 0 0 -2 -4" />
    <Path d="M14 9h-2" />
    <Path d="M14 15h-2" />
    <Path d="M10 12h.01" />
  </Svg>
);
export default SvgBrandMantine;

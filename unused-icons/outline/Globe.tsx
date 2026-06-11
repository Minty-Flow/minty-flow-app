import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgGlobe = (props: SvgProps) => (
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
    <Path d="M7 9a4 4 0 1 0 8 0a4 4 0 0 0 -8 0" />
    <Path d="M5.75 15a8.015 8.015 0 1 0 9.25 -13" />
    <Path d="M11 17v4" />
    <Path d="M7 21h8" />
  </Svg>
);
export default SvgGlobe;

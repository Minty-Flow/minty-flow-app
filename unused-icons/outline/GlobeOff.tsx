import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgGlobeOff = (props: SvgProps) => (
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
    <Path d="M7.353 7.355a4 4 0 0 0 5.29 5.293m2.007 -2.009a4 4 0 0 0 -5.3 -5.284" />
    <Path d="M5.75 15a8.015 8.015 0 0 0 9.792 .557m2.02 -1.998a8.015 8.015 0 0 0 -2.562 -11.559" />
    <Path d="M11 17v4" />
    <Path d="M7 21h8" />
    <Path d="M3 3l18 18" />
  </Svg>
);
export default SvgGlobeOff;

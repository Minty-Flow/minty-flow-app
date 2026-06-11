import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgHeadingOff = (props: SvgProps) => (
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
    <Path d="M7 12h5m4 0h1" />
    <Path d="M7 7v12" />
    <Path d="M17 5v8m0 4v2" />
    <Path d="M15 19h4" />
    <Path d="M15 5h4" />
    <Path d="M5 19h4" />
    <Path d="M3 3l18 18" />
  </Svg>
);
export default SvgHeadingOff;

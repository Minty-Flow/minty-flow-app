import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgError404Off = (props: SvgProps) => (
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
    <Path d="M3 8v3a1 1 0 0 0 1 1h3" />
    <Path d="M7 8v8" />
    <Path d="M17 8v3a1 1 0 0 0 1 1h3" />
    <Path d="M21 8v8" />
    <Path d="M10 10v4a2 2 0 1 0 4 0m0 -4a2 2 0 0 0 -2 -2" />
    <Path d="M3 3l18 18" />
  </Svg>
);
export default SvgError404Off;

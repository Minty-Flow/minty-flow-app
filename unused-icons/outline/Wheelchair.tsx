import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgWheelchair = (props: SvgProps) => (
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
    <Path d="M3 16a5 5 0 1 0 10 0a5 5 0 1 0 -10 0" />
    <Path d="M17 19a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
    <Path d="M19 17a3 3 0 0 0 -3 -3h-3.4" />
    <Path d="M3 3h1a2 2 0 0 1 2 2v6" />
    <Path d="M6 8h11" />
    <Path d="M15 8v6" />
  </Svg>
);
export default SvgWheelchair;

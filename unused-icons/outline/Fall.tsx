import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgFall = (props: SvgProps) => (
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
    <Path d="M11 21l1 -5l-1 -4l-3 -4h4l3 -3" />
    <Path d="M6 16l-1 -4l3 -4" />
    <Path d="M5 5a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
    <Path d="M13.5 12h2.5l4 2" />
  </Svg>
);
export default SvgFall;

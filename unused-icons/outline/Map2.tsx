import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgMap2 = (props: SvgProps) => (
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
    <Path d="M12 18.5l-3 -1.5l-6 3v-13l6 -3l6 3l6 -3v7.5" />
    <Path d="M9 4v13" />
    <Path d="M15 7v5.5" />
    <Path d="M21.121 20.121a3 3 0 1 0 -4.242 0c.418 .419 1.125 1.045 2.121 1.879c1.051 -.89 1.759 -1.516 2.121 -1.879" />
    <Path d="M19 18v.01" />
  </Svg>
);
export default SvgMap2;

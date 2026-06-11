import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgPlugX = (props: SvgProps) => (
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
    <Path d="M13.55 17.733a5.806 5.806 0 0 1 -7.356 -4.052a5.81 5.81 0 0 1 1.537 -5.627l2.054 -2.054l7.165 7.165" />
    <Path d="M4 20l3.5 -3.5" />
    <Path d="M15 4l-3.5 3.5" />
    <Path d="M20 9l-3.5 3.5" />
    <Path d="M16 16l4 4" />
    <Path d="M20 16l-4 4" />
  </Svg>
);
export default SvgPlugX;

import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgDrone = (props: SvgProps) => (
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
    <Path d="M10 10h4v4h-4l0 -4" />
    <Path d="M10 10l-3.5 -3.5" />
    <Path d="M9.96 6a3.5 3.5 0 1 0 -3.96 3.96" />
    <Path d="M14 10l3.5 -3.5" />
    <Path d="M18 9.96a3.5 3.5 0 1 0 -3.96 -3.96" />
    <Path d="M14 14l3.5 3.5" />
    <Path d="M14.04 18a3.5 3.5 0 1 0 3.96 -3.96" />
    <Path d="M10 14l-3.5 3.5" />
    <Path d="M6 14.04a3.5 3.5 0 1 0 3.96 3.96" />
  </Svg>
);
export default SvgDrone;

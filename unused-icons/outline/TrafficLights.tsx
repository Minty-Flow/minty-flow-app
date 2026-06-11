import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgTrafficLights = (props: SvgProps) => (
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
    <Path d="M7 7a5 5 0 0 1 5 -5a5 5 0 0 1 5 5v10a5 5 0 0 1 -5 5a5 5 0 0 1 -5 -5l0 -10" />
    <Path d="M11 7a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
    <Path d="M11 12a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
    <Path d="M11 17a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
  </Svg>
);
export default SvgTrafficLights;

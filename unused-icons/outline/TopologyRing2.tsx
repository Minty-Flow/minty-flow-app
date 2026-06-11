import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgTopologyRing2 = (props: SvgProps) => (
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
    <Path d="M14 6a2 2 0 1 0 -4 0a2 2 0 0 0 4 0" />
    <Path d="M7 18a2 2 0 1 0 -4 0a2 2 0 0 0 4 0" />
    <Path d="M21 18a2 2 0 1 0 -4 0a2 2 0 0 0 4 0" />
    <Path d="M7 18h10" />
    <Path d="M18 16l-5 -8" />
    <Path d="M11 8l-5 8" />
  </Svg>
);
export default SvgTopologyRing2;

import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgTentOff = (props: SvgProps) => (
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
    <Path d="M11 14l4 6h5m-2.863 -6.868l-5.137 -9.132l-1.44 2.559m-1.44 2.563l-6.12 10.878h6l4 -6" />
    <Path d="M3 3l18 18" />
  </Svg>
);
export default SvgTentOff;

import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgCarTurbine = (props: SvgProps) => (
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
    <Path d="M7 13a4 4 0 1 0 8 0a4 4 0 1 0 -8 0" />
    <Path d="M18.86 11c.088 .66 .14 1.512 .14 2a8 8 0 1 1 -8 -8h6" />
    <Path d="M11 9c2.489 .108 4.489 .108 6 0" />
    <Path d="M17 4a1 1 0 0 1 1 -1h2a1 1 0 0 1 1 1v6a1 1 0 0 1 -1 1h-2a1 1 0 0 1 -1 -1l0 -6" />
    <Path d="M11 13l-3.5 -1.5" />
    <Path d="M11 13l2.5 3" />
    <Path d="M8.5 16l2.5 -3" />
    <Path d="M11 13l3.5 -1.5" />
    <Path d="M11 9v4" />
  </Svg>
);
export default SvgCarTurbine;

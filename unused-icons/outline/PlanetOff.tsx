import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgPlanetOff = (props: SvgProps) => (
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
    <Path d="M7.042 7.059a7 7 0 0 0 9.908 9.89m1.581 -2.425a7 7 0 0 0 -9.057 -9.054" />
    <Path d="M3 3l18 18" />
  </Svg>
);
export default SvgPlanetOff;

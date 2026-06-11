import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgTemperatureFahrenheit = (props: SvgProps) => (
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
    <Path d="M4 8a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
    <Path d="M13 12l5 0" />
    <Path d="M20 6h-6a1 1 0 0 0 -1 1v11" />
  </Svg>
);
export default SvgTemperatureFahrenheit;

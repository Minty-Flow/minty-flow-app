import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgTemperatureCelsius = (props: SvgProps) => (
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
    <Path d="M20 9a3 3 0 0 0 -3 -3h-1a3 3 0 0 0 -3 3v6a3 3 0 0 0 3 3h1a3 3 0 0 0 3 -3" />
  </Svg>
);
export default SvgTemperatureCelsius;

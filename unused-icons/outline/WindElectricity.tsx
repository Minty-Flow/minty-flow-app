import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgWindElectricity = (props: SvgProps) => (
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
    <Path d="M20 7l-3 5h4l-3 5" />
    <Path d="M3 16h4a2 2 0 1 1 0 4" />
    <Path d="M3 12h8a2 2 0 1 0 0 -4" />
    <Path d="M3 8h3a2 2 0 1 0 0 -4" />
  </Svg>
);
export default SvgWindElectricity;

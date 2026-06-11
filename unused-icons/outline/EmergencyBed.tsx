import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgEmergencyBed = (props: SvgProps) => (
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
    <Path d="M14 18a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
    <Path d="M6 18a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
    <Path d="M4 8l2.1 2.8a3 3 0 0 0 2.4 1.2h11.5" />
    <Path d="M10 6h4" />
    <Path d="M12 4v4" />
    <Path d="M12 12v2l-2.5 2.5" />
    <Path d="M14.5 16.5l-2.5 -2.5" />
  </Svg>
);
export default SvgEmergencyBed;

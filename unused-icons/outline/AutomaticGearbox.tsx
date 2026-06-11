import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgAutomaticGearbox = (props: SvgProps) => (
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
    <Path d="M17 17v4h1a2 2 0 1 0 0 -4h-1" />
    <Path d="M17 11h1.5a1.5 1.5 0 0 0 0 -3h-1.5v5" />
    <Path d="M3 5a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
    <Path d="M5 7v3a1 1 0 0 0 1 1h3v7a1 1 0 0 0 1 1h3" />
    <Path d="M9 11h4" />
  </Svg>
);
export default SvgAutomaticGearbox;

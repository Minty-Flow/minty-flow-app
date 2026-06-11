import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgManualGearbox = (props: SvgProps) => (
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
    <Path d="M3 6a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
    <Path d="M10 6a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
    <Path d="M17 6a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
    <Path d="M3 18a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
    <Path d="M10 18a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
    <Path d="M5 8l0 8" />
    <Path d="M12 8l0 8" />
    <Path d="M19 8v2a2 2 0 0 1 -2 2h-12" />
  </Svg>
);
export default SvgManualGearbox;

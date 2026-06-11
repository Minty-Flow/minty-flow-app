import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgSteam = (props: SvgProps) => (
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
    <Path d="M11 4a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
    <Path d="M3 12a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
    <Path d="M19 12a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
    <Path d="M11 20a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
    <Path d="M5.5 5.5l3 3" />
    <Path d="M15.5 15.5l3 3" />
    <Path d="M18.5 5.5l-3 3" />
    <Path d="M8.5 15.5l-3 3" />
  </Svg>
);
export default SvgSteam;

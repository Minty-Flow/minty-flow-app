import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgBusStop = (props: SvgProps) => (
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
    <Path d="M3 4a1 1 0 0 1 1 -1h2a1 1 0 0 1 1 1v4a1 1 0 0 1 -1 1h-2a1 1 0 0 1 -1 -1l0 -4" />
    <Path d="M16 17a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
    <Path d="M10 5h7c2.761 0 5 3.134 5 7v5h-2" />
    <Path d="M16 17h-8" />
    <Path d="M16 5l1.5 7h4.5" />
    <Path d="M9.5 10h7.5" />
    <Path d="M12 5v5" />
    <Path d="M5 9v11" />
  </Svg>
);
export default SvgBusStop;

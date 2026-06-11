import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgBusOff = (props: SvgProps) => (
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
    <Path d="M4 17a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
    <Path d="M16.18 16.172a2 2 0 0 0 2.652 2.648" />
    <Path d="M4 17h-2v-11a1 1 0 0 1 1 -1h2m4 0h8c2.761 0 5 3.134 5 7v5h-1m-5 0h-8" />
    <Path d="M16 5l1.5 7h4.5" />
    <Path d="M2 10h8m4 0h3" />
    <Path d="M7 7v3" />
    <Path d="M12 5v3" />
    <Path d="M3 3l18 18" />
  </Svg>
);
export default SvgBusOff;

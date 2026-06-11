import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgRadioOff = (props: SvgProps) => (
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
    <Path d="M14 3l-4.986 2m-2.875 1.15l-1.51 .604a1 1 0 0 0 -.629 .928v11.323a1 1 0 0 0 1 1h14a1 1 0 0 0 .708 -.294m.292 -3.706v-8a1 1 0 0 0 -1 -1h-8m-4 0h-2.5" />
    <Path d="M4 12h8m4 0h4" />
    <Path d="M7 12v-2" />
    <Path d="M13 16v.01" />
    <Path d="M3 3l18 18" />
  </Svg>
);
export default SvgRadioOff;

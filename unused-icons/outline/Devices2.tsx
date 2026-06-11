import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgDevices2 = (props: SvgProps) => (
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
    <Path d="M10 15h-6a1 1 0 0 1 -1 -1v-8a1 1 0 0 1 1 -1h6" />
    <Path d="M13 5a1 1 0 0 1 1 -1h6a1 1 0 0 1 1 1v14a1 1 0 0 1 -1 1h-6a1 1 0 0 1 -1 -1l0 -14" />
    <Path d="M7 19l3 0" />
    <Path d="M17 8l0 .01" />
    <Path d="M16 16a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
    <Path d="M9 15l0 4" />
  </Svg>
);
export default SvgDevices2;

import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgDeviceTabletX = (props: SvgProps) => (
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
    <Path d="M13 21h-7a1 1 0 0 1 -1 -1v-16a1 1 0 0 1 1 -1h12a1 1 0 0 1 1 1v9.5" />
    <Path d="M22 22l-5 -5" />
    <Path d="M17 22l5 -5" />
    <Path d="M11 17a1 1 0 1 0 2 0a1 1 0 0 0 -2 0" />
  </Svg>
);
export default SvgDeviceTabletX;

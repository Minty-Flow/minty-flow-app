import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgDeviceNintendo = (props: SvgProps) => (
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
    <Path d="M10 20v-16h-3a4 4 0 0 0 -4 4v8a4 4 0 0 0 4 4h3" />
    <Path d="M14 20v-16h3a4 4 0 0 1 4 4v8a4 4 0 0 1 -4 4h-3" />
    <Path d="M16.5 15.5a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" fill="currentColor" />
    <Path d="M5.5 8.5a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" fill="currentColor" />
  </Svg>
);
export default SvgDeviceNintendo;

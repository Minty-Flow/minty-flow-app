import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgDevicesOff = (props: SvgProps) => (
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
    <Path d="M13 9a1 1 0 0 1 1 -1h6a1 1 0 0 1 1 1v8m-1 3h-6a1 1 0 0 1 -1 -1v-6" />
    <Path d="M18 8v-3a1 1 0 0 0 -1 -1h-9m-4 0a1 1 0 0 0 -1 1v12a1 1 0 0 0 1 1h9" />
    <Path d="M16 9h2" />
    <Path d="M3 3l18 18" />
  </Svg>
);
export default SvgDevicesOff;

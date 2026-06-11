import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgDeviceAirpodsCase = (props: SvgProps) => (
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
    <Path d="M21 10h-18" />
    <Path d="M3 8a4 4 0 0 1 4 -4h10a4 4 0 0 1 4 4v8a4 4 0 0 1 -4 4h-10a4 4 0 0 1 -4 -4l0 -8" />
    <Path d="M7 10v1.5a1.5 1.5 0 0 0 1.5 1.5h7a1.5 1.5 0 0 0 1.5 -1.5v-1.5" />
  </Svg>
);
export default SvgDeviceAirpodsCase;

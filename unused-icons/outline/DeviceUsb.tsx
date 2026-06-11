import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgDeviceUsb = (props: SvgProps) => (
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
    <Path d="M7 8h10v8a5 5 0 0 1 -10 0l0 -8" />
    <Path d="M9 8v-5h6v5" />
  </Svg>
);
export default SvgDeviceUsb;

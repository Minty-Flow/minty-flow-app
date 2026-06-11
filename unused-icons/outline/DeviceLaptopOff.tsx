import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgDeviceLaptopOff = (props: SvgProps) => (
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
    <Path d="M3 19h16" />
    <Path d="M10 6h8a1 1 0 0 1 1 1v8m-3 1h-10a1 1 0 0 1 -1 -1v-8a1 1 0 0 1 1 -1" />
    <Path d="M3 3l18 18" />
  </Svg>
);
export default SvgDeviceLaptopOff;

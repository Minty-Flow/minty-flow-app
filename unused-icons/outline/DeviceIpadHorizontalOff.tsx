import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgDeviceIpadHorizontalOff = (props: SvgProps) => (
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
    <Path d="M8 4h12a2 2 0 0 1 2 2v12m-2 2h-16a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2" />
    <Path d="M9 17h6" />
    <Path d="M3 3l18 18" />
  </Svg>
);
export default SvgDeviceIpadHorizontalOff;

import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgDeviceTvOff = (props: SvgProps) => (
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
    <Path d="M11 7h8a2 2 0 0 1 2 2v8m-1.178 2.824c-.25 .113 -.529 .176 -.822 .176h-14a2 2 0 0 1 -2 -2v-9a2 2 0 0 1 2 -2h2" />
    <Path d="M16 3l-4 4l-4 -4" />
    <Path d="M3 3l18 18" />
  </Svg>
);
export default SvgDeviceTvOff;

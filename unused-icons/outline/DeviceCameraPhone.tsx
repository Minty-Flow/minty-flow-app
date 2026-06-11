import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgDeviceCameraPhone = (props: SvgProps) => (
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
    <Path d="M16 8.5a2.5 2.5 0 1 0 5 0a2.5 2.5 0 1 0 -5 0" />
    <Path d="M13 7h-8a2 2 0 0 0 -2 2v7a2 2 0 0 0 2 2h13a2 2 0 0 0 2 -2v-2" />
    <Path d="M17 15v-1" />
  </Svg>
);
export default SvgDeviceCameraPhone;

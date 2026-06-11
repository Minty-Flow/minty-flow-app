import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgDevicesPcOff = (props: SvgProps) => (
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
    <Path d="M9 9v10h-6v-14h2" />
    <Path d="M13 9h9v7h-2m-4 0h-4v-4" />
    <Path d="M14 19h5" />
    <Path d="M17 17v2" />
    <Path d="M6 13v.01" />
    <Path d="M6 16v.01" />
    <Path d="M3 3l18 18" />
  </Svg>
);
export default SvgDevicesPcOff;

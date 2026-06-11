import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgDevicesUp = (props: SvgProps) => (
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
    <Path d="M13 16.5v-7.5a1 1 0 0 1 1 -1h6a1 1 0 0 1 1 1v3.5" />
    <Path d="M18 8v-3a1 1 0 0 0 -1 -1h-13a1 1 0 0 0 -1 1v12a1 1 0 0 0 1 1h8" />
    <Path d="M19 22v-6" />
    <Path d="M22 19l-3 -3l-3 3" />
    <Path d="M16 9h2" />
  </Svg>
);
export default SvgDevicesUp;

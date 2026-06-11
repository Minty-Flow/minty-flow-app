import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgDeviceDesktopUp = (props: SvgProps) => (
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
    <Path d="M13.5 16h-9.5a1 1 0 0 1 -1 -1v-10a1 1 0 0 1 1 -1h16a1 1 0 0 1 1 1v7.5" />
    <Path d="M19 22v-6" />
    <Path d="M22 19l-3 -3l-3 3" />
    <Path d="M7 20h5" />
    <Path d="M9 16v4" />
  </Svg>
);
export default SvgDeviceDesktopUp;

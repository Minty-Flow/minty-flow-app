import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgDeviceImacBolt = (props: SvgProps) => (
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
    <Path d="M13.5 17h-9.5a1 1 0 0 1 -1 -1v-12a1 1 0 0 1 1 -1h16a1 1 0 0 1 1 1v8.5" />
    <Path d="M3 13h13" />
    <Path d="M8 21h5.5" />
    <Path d="M10 17l-.5 4" />
    <Path d="M19 16l-2 3h4l-2 3" />
  </Svg>
);
export default SvgDeviceImacBolt;

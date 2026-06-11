import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgDeviceImacOff = (props: SvgProps) => (
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
    <Path d="M7 3h13a1 1 0 0 1 1 1v12c0 .28 -.115 .532 -.3 .713m-3.7 .287h-13a1 1 0 0 1 -1 -1v-12c0 -.276 .112 -.526 .293 -.707" />
    <Path d="M3 13h10m4 0h4" />
    <Path d="M8 21h8" />
    <Path d="M10 17l-.5 4" />
    <Path d="M14 17l.5 4" />
    <Path d="M3 3l18 18" />
  </Svg>
);
export default SvgDeviceImacOff;

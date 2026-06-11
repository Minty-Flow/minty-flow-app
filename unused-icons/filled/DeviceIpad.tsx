import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgDeviceIpad = (props: SvgProps) => (
  <Svg
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    <Path d="M18 2a3 3 0 0 1 3 3v14a3 3 0 0 1 -3 3h-12a3 3 0 0 1 -3 -3v-14a3 3 0 0 1 3 -3zm-3 16h-6a1 1 0 0 0 0 2h6a1 1 0 0 0 0 -2" />
  </Svg>
);
export default SvgDeviceIpad;

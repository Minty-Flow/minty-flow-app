import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgDeviceComputerCamera = (props: SvgProps) => (
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
    <Path d="M5 10a7 7 0 1 0 14 0a7 7 0 1 0 -14 0" />
    <Path d="M9 10a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
    <Path d="M8 16l-2.091 3.486a1 1 0 0 0 .857 1.514h10.468a1 1 0 0 0 .857 -1.514l-2.091 -3.486" />
  </Svg>
);
export default SvgDeviceComputerCamera;

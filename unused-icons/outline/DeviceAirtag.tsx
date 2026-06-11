import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgDeviceAirtag = (props: SvgProps) => (
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
    <Path d="M4 12a8 8 0 1 0 16 0a8 8 0 0 0 -16 0" />
    <Path d="M9 15v.01" />
    <Path d="M15 15a6 6 0 0 0 -6 -6" />
    <Path d="M12 15a3 3 0 0 0 -3 -3" />
  </Svg>
);
export default SvgDeviceAirtag;

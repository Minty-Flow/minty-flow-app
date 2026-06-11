import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgDeviceRemote = (props: SvgProps) => (
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
    <Path d="M10 10a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
    <Path d="M7 5a2 2 0 0 1 2 -2h6a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-6a2 2 0 0 1 -2 -2l0 -14" />
    <Path d="M12 3v2" />
    <Path d="M10 15v.01" />
    <Path d="M10 18v.01" />
    <Path d="M14 18v.01" />
    <Path d="M14 15v.01" />
  </Svg>
);
export default SvgDeviceRemote;

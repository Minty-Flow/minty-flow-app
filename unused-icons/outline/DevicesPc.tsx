import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgDevicesPc = (props: SvgProps) => (
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
    <Path d="M3 5h6v14h-6l0 -14" />
    <Path d="M12 9h10v7h-10l0 -7" />
    <Path d="M14 19h6" />
    <Path d="M17 16v3" />
    <Path d="M6 13v.01" />
    <Path d="M6 16v.01" />
  </Svg>
);
export default SvgDevicesPc;

import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgDeviceCctv = (props: SvgProps) => (
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
    <Path d="M3 4a1 1 0 0 1 1 -1h16a1 1 0 0 1 1 1v2a1 1 0 0 1 -1 1h-16a1 1 0 0 1 -1 -1l0 -2" />
    <Path d="M8 14a4 4 0 1 0 8 0a4 4 0 1 0 -8 0" />
    <Path d="M19 7v7a7 7 0 0 1 -14 0v-7" />
    <Path d="M12 14l.01 0" />
  </Svg>
);
export default SvgDeviceCctv;

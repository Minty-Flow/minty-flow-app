import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgWifiOff = (props: SvgProps) => (
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
    <Path d="M12 18l.01 0" />
    <Path d="M9.172 15.172a4 4 0 0 1 5.656 0" />
    <Path d="M6.343 12.343a7.963 7.963 0 0 1 3.864 -2.14m4.163 .155a7.965 7.965 0 0 1 3.287 2" />
    <Path d="M3.515 9.515a12 12 0 0 1 3.544 -2.455m3.101 -.92a12 12 0 0 1 10.325 3.374" />
    <Path d="M3 3l18 18" />
  </Svg>
);
export default SvgWifiOff;

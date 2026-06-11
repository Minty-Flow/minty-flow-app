import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgMicrophone = (props: SvgProps) => (
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
    <Path d="M9 5a3 3 0 0 1 3 -3a3 3 0 0 1 3 3v5a3 3 0 0 1 -3 3a3 3 0 0 1 -3 -3l0 -5" />
    <Path d="M5 10a7 7 0 0 0 14 0" />
    <Path d="M8 21l8 0" />
    <Path d="M12 17l0 4" />
  </Svg>
);
export default SvgMicrophone;

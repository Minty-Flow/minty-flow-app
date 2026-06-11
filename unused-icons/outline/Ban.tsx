import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgBan = (props: SvgProps) => (
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
    <Path d="M3 12a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
    <Path d="M5.7 5.7l12.6 12.6" />
  </Svg>
);
export default SvgBan;

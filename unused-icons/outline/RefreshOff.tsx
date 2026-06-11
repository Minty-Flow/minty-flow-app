import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgRefreshOff = (props: SvgProps) => (
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
    <Path d="M20 11a8.1 8.1 0 0 0 -11.271 -6.305m-2.41 1.624a8.083 8.083 0 0 0 -1.819 2.681m-.5 -4v4h4" />
    <Path d="M4 13a8.1 8.1 0 0 0 13.671 4.691m2.329 -1.691v-1h-1" />
    <Path d="M3 3l18 18" />
  </Svg>
);
export default SvgRefreshOff;

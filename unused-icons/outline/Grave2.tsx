import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgGrave2 = (props: SvgProps) => (
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
    <Path d="M7 16.17v-9.17a3 3 0 0 1 3 -3h4a3 3 0 0 1 3 3v9.171" />
    <Path d="M12 7v5" />
    <Path d="M10 9h4" />
    <Path d="M5 21v-2a3 3 0 0 1 3 -3h8a3 3 0 0 1 3 3v2h-14" />
  </Svg>
);
export default SvgGrave2;

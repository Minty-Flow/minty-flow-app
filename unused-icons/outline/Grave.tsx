import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgGrave = (props: SvgProps) => (
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
    <Path d="M5 21v-2a3 3 0 0 1 3 -3h8a3 3 0 0 1 3 3v2h-14" />
    <Path d="M10 16v-5h-4v-4h4v-4h4v4h4v4h-4v5" />
  </Svg>
);
export default SvgGrave;

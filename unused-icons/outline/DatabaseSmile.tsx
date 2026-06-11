import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgDatabaseSmile = (props: SvgProps) => (
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
    <Path d="M10 14h.01" />
    <Path d="M14 14h.01" />
    <Path d="M10 17a3.5 3.5 0 0 0 4 0" />
    <Path d="M4 6c0 1.657 3.582 3 8 3s8 -1.343 8 -3s-3.582 -3 -8 -3s-8 1.343 -8 3" />
    <Path d="M4 6v12c0 1.657 3.582 3 8 3s8 -1.343 8 -3v-12" />
  </Svg>
);
export default SvgDatabaseSmile;

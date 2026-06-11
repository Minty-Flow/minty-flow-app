import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgMonkeybar = (props: SvgProps) => (
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
    <Path d="M3 21v-15l5 -3l5 3v15" />
    <Path d="M8 21v-7" />
    <Path d="M3 14h10" />
    <Path d="M6 10a2 2 0 1 1 4 0" />
    <Path d="M13 13c6 0 3 8 8 8" />
  </Svg>
);
export default SvgMonkeybar;

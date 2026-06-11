import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgFileSymlink = (props: SvgProps) => (
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
    <Path d="M4 21v-4a3 3 0 0 1 3 -3h5" />
    <Path d="M9 17l3 -3l-3 -3" />
    <Path d="M14 3v4a1 1 0 0 0 1 1h4" />
    <Path d="M5 11v-6a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2h-9.5" />
  </Svg>
);
export default SvgFileSymlink;

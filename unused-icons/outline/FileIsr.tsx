import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgFileIsr = (props: SvgProps) => (
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
    <Path d="M15 3v4a1 1 0 0 0 1 1h4" />
    <Path d="M15 3v4a1 1 0 0 0 1 1h4" />
    <Path d="M6 8v-3a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2v-7" />
    <Path d="M3 15l3 -3l3 3" />
  </Svg>
);
export default SvgFileIsr;

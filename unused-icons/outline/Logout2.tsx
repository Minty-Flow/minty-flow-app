import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgLogout2 = (props: SvgProps) => (
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
    <Path d="M10 8v-2a2 2 0 0 1 2 -2h7a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-7a2 2 0 0 1 -2 -2v-2" />
    <Path d="M15 12h-12l3 -3" />
    <Path d="M6 15l-3 -3" />
  </Svg>
);
export default SvgLogout2;

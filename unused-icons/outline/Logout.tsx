import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgLogout = (props: SvgProps) => (
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
    <Path d="M14 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2" />
    <Path d="M9 12h12l-3 -3" />
    <Path d="M18 15l3 -3" />
  </Svg>
);
export default SvgLogout;

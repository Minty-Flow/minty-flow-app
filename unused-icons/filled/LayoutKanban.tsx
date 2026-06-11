import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgLayoutKanban = (props: SvgProps) => (
  <Svg
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    <Path d="M10 3a1 1 0 0 1 0 2h-6a1 1 0 1 1 0 -2z" />
    <Path d="M20 3a1 1 0 0 1 0 2h-6a1 1 0 0 1 0 -2z" />
    <Path d="M8 7a3 3 0 0 1 3 3v8a3 3 0 0 1 -3 3h-2a3 3 0 0 1 -3 -3v-8a3 3 0 0 1 3 -3z" />
    <Path d="M18 7a3 3 0 0 1 3 3v2a3 3 0 0 1 -3 3h-2a3 3 0 0 1 -3 -3v-2a3 3 0 0 1 3 -3z" />
  </Svg>
);
export default SvgLayoutKanban;

import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgMessageUser = (props: SvgProps) => (
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
    <Path d="M13 18l-5 3v-3h-2a3 3 0 0 1 -3 -3v-8a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v4.5" />
    <Path d="M17 17a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
    <Path d="M22 22a2 2 0 0 0 -2 -2h-2a2 2 0 0 0 -2 2" />
  </Svg>
);
export default SvgMessageUser;

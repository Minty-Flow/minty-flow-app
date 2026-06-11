import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgSpy = (props: SvgProps) => (
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
    <Path d="M3 11h18" />
    <Path d="M5 11v-4a3 3 0 0 1 3 -3h8a3 3 0 0 1 3 3v4" />
    <Path d="M4 17a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
    <Path d="M14 17a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
    <Path d="M10 17h4" />
  </Svg>
);
export default SvgSpy;

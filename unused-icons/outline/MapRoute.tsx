import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgMapRoute = (props: SvgProps) => (
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
    <Path d="M3 7l6 -3l6 3l6 -3v13l-6 3l-6 -3l-6 3v-13" />
    <Path d="M9 12v.01" />
    <Path d="M6 13v.01" />
    <Path d="M17 15l-4 -4" />
    <Path d="M13 15l4 -4" />
  </Svg>
);
export default SvgMapRoute;

import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgArrowsDoubleNwSe = (props: SvgProps) => (
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
    <Path d="M14 21l-11 -11" />
    <Path d="M3 14v-4h4" />
    <Path d="M17 14h4v-4" />
    <Path d="M10 3l11 11" />
  </Svg>
);
export default SvgArrowsDoubleNwSe;

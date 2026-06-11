import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgSunglasses = (props: SvgProps) => (
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
    <Path d="M8 4h-2l-3 10" />
    <Path d="M16 4h2l3 10" />
    <Path d="M10 16h4" />
    <Path d="M21 16.5a3.5 3.5 0 0 1 -7 0v-2.5h7v2.5" />
    <Path d="M10 16.5a3.5 3.5 0 0 1 -7 0v-2.5h7v2.5" />
    <Path d="M4 14l4.5 4.5" />
    <Path d="M15 14l4.5 4.5" />
  </Svg>
);
export default SvgSunglasses;

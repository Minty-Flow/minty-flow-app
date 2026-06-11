import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgPlayBasketball = (props: SvgProps) => (
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
    <Path d="M10 4a1 1 0 1 0 2 0a1 1 0 0 0 -2 0" />
    <Path d="M5 21l3 -3l.75 -1.5" />
    <Path d="M14 21v-4l-4 -3l.5 -6" />
    <Path d="M5 12l1 -3l4.5 -1l3.5 3l4 1" />
    <Path d="M18.5 16a.5 .5 0 1 0 0 -1a.5 .5 0 0 0 0 1" fill="currentColor" />
  </Svg>
);
export default SvgPlayBasketball;

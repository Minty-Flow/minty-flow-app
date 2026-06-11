import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgHandThreeFingers = (props: SvgProps) => (
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
    <Path d="M8 13v-8.5a1.5 1.5 0 0 1 3 0v7.5" />
    <Path d="M17 11.5a1.5 1.5 0 0 1 3 0v4.5a6 6 0 0 1 -6 6h-2h.208a6 6 0 0 1 -5.012 -2.7a69.74 69.74 0 0 1 -.196 -.3c-.312 -.479 -1.407 -2.388 -3.286 -5.728a1.5 1.5 0 0 1 .536 -2.022a1.867 1.867 0 0 1 2.28 .28l1.47 1.47" />
    <Path d="M11 5.5v-2a1.5 1.5 0 1 1 3 0v8.5" />
    <Path d="M14 5.5a1.5 1.5 0 0 1 3 0v6.5" />
  </Svg>
);
export default SvgHandThreeFingers;

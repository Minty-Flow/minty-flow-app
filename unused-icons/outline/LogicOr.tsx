import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgLogicOr = (props: SvgProps) => (
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
    <Path d="M22 12h-6" />
    <Path d="M2 9h7" />
    <Path d="M2 15h7" />
    <Path d="M8 5c10.667 2.1 10.667 12.6 0 14c1.806 -4.667 1.806 -9.333 0 -14" />
  </Svg>
);
export default SvgLogicOr;

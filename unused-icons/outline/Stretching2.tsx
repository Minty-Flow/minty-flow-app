import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgStretching2 = (props: SvgProps) => (
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
    <Path d="M11 4a1 1 0 1 0 2 0a1 1 0 0 0 -2 0" />
    <Path d="M6.5 21l3.5 -5" />
    <Path d="M5 11l7 -2" />
    <Path d="M16 21l-4 -7v-5l7 -4" />
  </Svg>
);
export default SvgStretching2;

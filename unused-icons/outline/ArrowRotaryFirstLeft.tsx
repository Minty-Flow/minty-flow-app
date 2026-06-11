import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgArrowRotaryFirstLeft = (props: SvgProps) => (
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
    <Path d="M16 10a3 3 0 1 1 0 -6a3 3 0 0 1 0 6" />
    <Path d="M16 10v10" />
    <Path d="M13.5 9.5l-8.5 8.5" />
    <Path d="M10 18h-5v-5" />
  </Svg>
);
export default SvgArrowRotaryFirstLeft;

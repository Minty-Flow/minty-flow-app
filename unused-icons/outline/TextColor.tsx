import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgTextColor = (props: SvgProps) => (
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
    <Path d="M9 15v-7a3 3 0 0 1 6 0v7" />
    <Path d="M9 11h6" />
    <Path d="M5 19h14" />
  </Svg>
);
export default SvgTextColor;

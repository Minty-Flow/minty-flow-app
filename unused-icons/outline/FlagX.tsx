import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgFlagX = (props: SvgProps) => (
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
    <Path d="M13.533 15.028a4.988 4.988 0 0 1 -1.533 -1.028a5 5 0 0 0 -7 0v-9a5 5 0 0 1 7 0a5 5 0 0 0 7 0v8.5" />
    <Path d="M5 21v-7" />
    <Path d="M22 22l-5 -5" />
    <Path d="M17 22l5 -5" />
  </Svg>
);
export default SvgFlagX;

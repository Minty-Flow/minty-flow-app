import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgFlagDiscount = (props: SvgProps) => (
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
    <Path d="M12.804 14.641a5.02 5.02 0 0 1 -.804 -.641a5 5 0 0 0 -7 0v-9a5 5 0 0 1 7 0a5 5 0 0 0 7 0v8" />
    <Path d="M5 21v-7" />
    <Path d="M16 21l5 -5" />
    <Path d="M21 21v.01" />
    <Path d="M16 16v.01" />
  </Svg>
);
export default SvgFlagDiscount;

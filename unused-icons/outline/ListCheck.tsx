import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgListCheck = (props: SvgProps) => (
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
    <Path d="M3.5 5.5l1.5 1.5l2.5 -2.5" />
    <Path d="M3.5 11.5l1.5 1.5l2.5 -2.5" />
    <Path d="M3.5 17.5l1.5 1.5l2.5 -2.5" />
    <Path d="M11 6l9 0" />
    <Path d="M11 12l9 0" />
    <Path d="M11 18l9 0" />
  </Svg>
);
export default SvgListCheck;

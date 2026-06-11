import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgBow = (props: SvgProps) => (
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
    <Path d="M17 3h4v4" />
    <Path d="M21 3l-15 15" />
    <Path d="M3 18h3v3" />
    <Path d="M16.5 20c1.576 -1.576 2.5 -4.095 2.5 -6.5c0 -4.81 -3.69 -8.5 -8.5 -8.5c-2.415 0 -4.922 .913 -6.5 2.5l12.5 12.5" />
  </Svg>
);
export default SvgBow;

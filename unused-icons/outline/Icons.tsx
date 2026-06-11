import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgIcons = (props: SvgProps) => (
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
    <Path d="M3 6.5a3.5 3.5 0 1 0 7 0a3.5 3.5 0 1 0 -7 0" />
    <Path d="M2.5 21h8l-4 -7l-4 7" />
    <Path d="M14 3l7 7" />
    <Path d="M14 10l7 -7" />
    <Path d="M14 14h7v7h-7l0 -7" />
  </Svg>
);
export default SvgIcons;

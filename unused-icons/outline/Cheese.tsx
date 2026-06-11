import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgCheese = (props: SvgProps) => (
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
    <Path d="M4.519 20.008l16.481 -.008v-3.5a2 2 0 1 1 0 -4v-3.5h-16.722" />
    <Path d="M21 9l-9.385 -4.992c-2.512 .12 -4.758 1.42 -6.327 3.425c-1.423 1.82 -2.288 4.221 -2.288 6.854c0 2.117 .56 4.085 1.519 5.721" />
    <Path d="M15 13v.01" />
    <Path d="M8 13v.01" />
    <Path d="M11 16v.01" />
  </Svg>
);
export default SvgCheese;

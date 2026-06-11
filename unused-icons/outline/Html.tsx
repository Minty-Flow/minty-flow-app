import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgHtml = (props: SvgProps) => (
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
    <Path d="M13 16v-8l2 5l2 -5v8" />
    <Path d="M1 16v-8" />
    <Path d="M5 8v8" />
    <Path d="M1 12h4" />
    <Path d="M7 8h4" />
    <Path d="M9 8v8" />
    <Path d="M20 8v8h3" />
  </Svg>
);
export default SvgHtml;

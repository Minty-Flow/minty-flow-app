import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgFileTypeHtml = (props: SvgProps) => (
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
    <Path d="M14 3v4a1 1 0 0 0 1 1h4" />
    <Path d="M5 12v-7a2 2 0 0 1 2 -2h7l5 5v4" />
    <Path d="M2 21v-6" />
    <Path d="M5 15v6" />
    <Path d="M2 18h3" />
    <Path d="M20 15v6h2" />
    <Path d="M13 21v-6l2 3l2 -3v6" />
    <Path d="M7.5 15h3" />
    <Path d="M9 15v6" />
  </Svg>
);
export default SvgFileTypeHtml;

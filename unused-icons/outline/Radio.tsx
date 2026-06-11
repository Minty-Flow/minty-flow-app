import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgRadio = (props: SvgProps) => (
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
    <Path d="M14 3l-9.371 3.749a1 1 0 0 0 -.629 .928v11.323a1 1 0 0 0 1 1h14a1 1 0 0 0 1 -1v-11a1 1 0 0 0 -1 -1h-14.5" />
    <Path d="M4 12h16" />
    <Path d="M7 12v-2" />
    <Path d="M17 16v.01" />
    <Path d="M13 16v.01" />
  </Svg>
);
export default SvgRadio;

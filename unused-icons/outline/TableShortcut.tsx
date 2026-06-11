import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgTableShortcut = (props: SvgProps) => (
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
    <Path d="M3 13v-8a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-8" />
    <Path d="M3 10h18" />
    <Path d="M10 3v11" />
    <Path d="M2 22l5 -5" />
    <Path d="M7 21.5v-4.5h-4.5" />
  </Svg>
);
export default SvgTableShortcut;

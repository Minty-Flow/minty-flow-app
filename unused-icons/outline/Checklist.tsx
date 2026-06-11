import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgChecklist = (props: SvgProps) => (
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
    <Path d="M9.615 20h-2.615a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2h8a2 2 0 0 1 2 2v8" />
    <Path d="M14 19l2 2l4 -4" />
    <Path d="M9 8h4" />
    <Path d="M9 12h2" />
  </Svg>
);
export default SvgChecklist;

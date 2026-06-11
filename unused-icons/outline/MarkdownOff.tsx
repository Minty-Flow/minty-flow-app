import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgMarkdownOff = (props: SvgProps) => (
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
    <Path d="M9 5h10a2 2 0 0 1 2 2v10" />
    <Path d="M19 19h-14a2 2 0 0 1 -2 -2v-10a2 2 0 0 1 1.85 -2" />
    <Path d="M7 15v-6l2 2l1 -1m1 1v4" />
    <Path d="M17.5 13.5l.5 -.5m-2 -1v-3" />
    <Path d="M3 3l18 18" />
  </Svg>
);
export default SvgMarkdownOff;

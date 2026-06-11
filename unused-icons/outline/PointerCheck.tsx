import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgPointerCheck = (props: SvgProps) => (
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
    <Path d="M17.487 14.93l-2.709 -2.708l3.113 -2.09a1.2 1.2 0 0 0 -.309 -2.228l-13.582 -3.904l3.904 13.563a1.2 1.2 0 0 0 2.228 .308l2.09 -3.093l.785 .785" />
    <Path d="M15 19l2 2l4 -4" />
  </Svg>
);
export default SvgPointerCheck;

import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgCodeCircle2 = (props: SvgProps) => (
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
    <Path d="M8.5 13.5l-1.5 -1.5l1.5 -1.5" />
    <Path d="M15.5 10.5l1.5 1.5l-1.5 1.5" />
    <Path d="M3 12a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
    <Path d="M13 9.5l-2 5.5" />
  </Svg>
);
export default SvgCodeCircle2;

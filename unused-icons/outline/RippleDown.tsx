import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgRippleDown = (props: SvgProps) => (
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
    <Path d="M3 7q 4.5 -3 9 0t 9 0" />
    <Path d="M3 17q 4.5 -3 9 0q .213 .142 .427 .27" />
    <Path d="M3 12q 4.5 -3 9 0q 2.006 1.338 4.012 1.482" />
    <Path d="M19 16v6" />
    <Path d="M22 19l-3 3l-3 -3" />
  </Svg>
);
export default SvgRippleDown;

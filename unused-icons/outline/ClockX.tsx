import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgClockX = (props: SvgProps) => (
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
    <Path d="M20.926 13.15a9 9 0 1 0 -7.835 7.784" />
    <Path d="M12 7v5l2 2" />
    <Path d="M22 22l-5 -5" />
    <Path d="M17 22l5 -5" />
  </Svg>
);
export default SvgClockX;

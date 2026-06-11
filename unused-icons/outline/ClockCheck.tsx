import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgClockCheck = (props: SvgProps) => (
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
    <Path d="M20.942 13.021a9 9 0 1 0 -9.407 7.967" />
    <Path d="M12 7v5l3 3" />
    <Path d="M15 19l2 2l4 -4" />
  </Svg>
);
export default SvgClockCheck;

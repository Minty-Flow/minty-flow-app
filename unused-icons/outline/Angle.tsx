import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgAngle = (props: SvgProps) => (
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
    <Path d="M21 19h-18l9 -15" />
    <Path d="M20.615 15.171h.015" />
    <Path d="M19.515 11.771h.015" />
    <Path d="M17.715 8.671h.015" />
    <Path d="M15.415 5.971h.015" />
  </Svg>
);
export default SvgAngle;

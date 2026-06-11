import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgXPowerY = (props: SvgProps) => (
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
    <Path d="M15 3l3 5.063" />
    <Path d="M5 12l6 6" />
    <Path d="M5 18l6 -6" />
    <Path d="M21 3l-4.8 9" />
  </Svg>
);
export default SvgXPowerY;

import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgLineDashed = (props: SvgProps) => (
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
    <Path d="M5 12h2" />
    <Path d="M17 12h2" />
    <Path d="M11 12h2" />
  </Svg>
);
export default SvgLineDashed;

import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgLineDotted = (props: SvgProps) => (
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
    <Path d="M4 12v.01" />
    <Path d="M8 12v.01" />
    <Path d="M12 12v.01" />
    <Path d="M16 12v.01" />
    <Path d="M20 12v.01" />
  </Svg>
);
export default SvgLineDotted;

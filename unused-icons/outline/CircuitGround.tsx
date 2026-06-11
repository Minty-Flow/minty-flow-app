import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgCircuitGround = (props: SvgProps) => (
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
    <Path d="M12 13v-8" />
    <Path d="M4 13h16" />
    <Path d="M7 16h10" />
    <Path d="M10 19h4" />
  </Svg>
);
export default SvgCircuitGround;

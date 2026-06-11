import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgCircuitPushbutton = (props: SvgProps) => (
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
    <Path d="M2 17h2" />
    <Path d="M20 17h2" />
    <Path d="M4 17a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
    <Path d="M16 17a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
    <Path d="M6 11h12" />
    <Path d="M12 11v-6" />
  </Svg>
);
export default SvgCircuitPushbutton;

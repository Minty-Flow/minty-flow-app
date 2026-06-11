import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgPhysotherapist = (props: SvgProps) => (
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
    <Path d="M9 15l-1 -3l4 -2l4 1h3.5" />
    <Path d="M3 19a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
    <Path d="M11 6a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
    <Path d="M12 17v-7" />
    <Path d="M8 20h7l1 -4l4 -2" />
    <Path d="M18 20h3" />
  </Svg>
);
export default SvgPhysotherapist;

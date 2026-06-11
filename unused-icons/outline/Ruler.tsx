import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgRuler = (props: SvgProps) => (
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
    <Path d="M5 4h14a1 1 0 0 1 1 1v5a1 1 0 0 1 -1 1h-7a1 1 0 0 0 -1 1v7a1 1 0 0 1 -1 1h-5a1 1 0 0 1 -1 -1v-14a1 1 0 0 1 1 -1" />
    <Path d="M4 8l2 0" />
    <Path d="M4 12l3 0" />
    <Path d="M4 16l2 0" />
    <Path d="M8 4l0 2" />
    <Path d="M12 4l0 3" />
    <Path d="M16 4l0 2" />
  </Svg>
);
export default SvgRuler;

import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgDualScreen = (props: SvgProps) => (
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
    <Path d="M5 4l8 3v15l-8 -3l0 -15" />
    <Path d="M13 19h6v-15h-14" />
  </Svg>
);
export default SvgDualScreen;

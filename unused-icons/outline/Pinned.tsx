import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgPinned = (props: SvgProps) => (
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
    <Path d="M9 4v6l-2 4v2h10v-2l-2 -4v-6" />
    <Path d="M12 16l0 5" />
    <Path d="M8 4l8 0" />
  </Svg>
);
export default SvgPinned;

import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgClearFormatting = (props: SvgProps) => (
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
    <Path d="M17 15l4 4m0 -4l-4 4" />
    <Path d="M7 6v-1h11v1" />
    <Path d="M7 19l4 0" />
    <Path d="M13 5l-4 14" />
  </Svg>
);
export default SvgClearFormatting;

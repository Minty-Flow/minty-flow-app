import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgFileBroken = (props: SvgProps) => (
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
    <Path d="M14 3v4a1 1 0 0 0 1 1h4" />
    <Path d="M5 7v-2a2 2 0 0 1 2 -2h7l5 5v2" />
    <Path d="M19 19a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2" />
    <Path d="M5 16h.01" />
    <Path d="M5 13h.01" />
    <Path d="M5 10h.01" />
    <Path d="M19 13h.01" />
    <Path d="M19 16h.01" />
  </Svg>
);
export default SvgFileBroken;

import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgMessageBolt = (props: SvgProps) => (
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
    <Path d="M8 9h8" />
    <Path d="M8 13h6" />
    <Path d="M13 18l-5 3v-3h-2a3 3 0 0 1 -3 -3v-8a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v5.5" />
    <Path d="M19 16l-2 3h4l-2 3" />
  </Svg>
);
export default SvgMessageBolt;

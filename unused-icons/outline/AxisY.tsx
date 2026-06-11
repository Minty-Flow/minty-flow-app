import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgAxisY = (props: SvgProps) => (
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
    <Path d="M11 20h-.01" />
    <Path d="M15 20h-.01" />
    <Path d="M19 20h-.01" />
    <Path d="M4 7l3 -3l3 3" />
    <Path d="M7 20v-16" />
  </Svg>
);
export default SvgAxisY;

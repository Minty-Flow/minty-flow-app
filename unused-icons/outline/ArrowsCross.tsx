import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgArrowsCross = (props: SvgProps) => (
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
    <Path d="M16 4h4v4" />
    <Path d="M15 9l5 -5" />
    <Path d="M4 20l5 -5" />
    <Path d="M16 20h4v-4" />
    <Path d="M4 4l16 16" />
  </Svg>
);
export default SvgArrowsCross;

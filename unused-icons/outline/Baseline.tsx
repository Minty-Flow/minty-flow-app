import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgBaseline = (props: SvgProps) => (
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
    <Path d="M4 20h16" />
    <Path d="M8 16v-8a4 4 0 1 1 8 0v8" />
    <Path d="M8 10h8" />
  </Svg>
);
export default SvgBaseline;

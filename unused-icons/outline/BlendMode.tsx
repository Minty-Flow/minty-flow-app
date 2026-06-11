import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgBlendMode = (props: SvgProps) => (
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
    <Path d="M8 9.5a6.5 6.5 0 1 0 13 0a6.5 6.5 0 1 0 -13 0" />
    <Path d="M3 14.5a6.5 6.5 0 1 0 13 0a6.5 6.5 0 1 0 -13 0" />
  </Svg>
);
export default SvgBlendMode;

import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgDisabled = (props: SvgProps) => (
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
    <Path d="M9 5a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
    <Path d="M11 7l0 8l4 0l4 5" />
    <Path d="M11 11l5 0" />
    <Path d="M7 11.5a5 5 0 1 0 6 7.5" />
  </Svg>
);
export default SvgDisabled;

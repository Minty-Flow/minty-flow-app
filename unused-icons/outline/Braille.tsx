import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgBraille = (props: SvgProps) => (
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
    <Path d="M15 5a1 1 0 1 0 2 0a1 1 0 0 0 -2 0" />
    <Path d="M7 5a1 1 0 1 0 2 0a1 1 0 0 0 -2 0" />
    <Path d="M7 19a1 1 0 1 0 2 0a1 1 0 0 0 -2 0" />
    <Path d="M16 12h.01" />
    <Path d="M8 12h.01" />
    <Path d="M16 19h.01" />
  </Svg>
);
export default SvgBraille;

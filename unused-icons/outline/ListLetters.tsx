import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgListLetters = (props: SvgProps) => (
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
    <Path d="M11 6h9" />
    <Path d="M11 12h9" />
    <Path d="M11 18h9" />
    <Path d="M4 10v-4.5a1.5 1.5 0 0 1 3 0v4.5" />
    <Path d="M4 8h3" />
    <Path d="M4 20h1.5a1.5 1.5 0 0 0 0 -3h-1.5h1.5a1.5 1.5 0 0 0 0 -3h-1.5v6" />
  </Svg>
);
export default SvgListLetters;

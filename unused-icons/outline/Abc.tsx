import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgAbc = (props: SvgProps) => (
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
    <Path d="M3 16v-6a2 2 0 1 1 4 0v6" />
    <Path d="M3 13h4" />
    <Path d="M10 8v6a2 2 0 1 0 4 0v-1a2 2 0 1 0 -4 0v1" />
    <Path d="M20.732 12a2 2 0 0 0 -3.732 1v1a2 2 0 0 0 3.726 1.01" />
  </Svg>
);
export default SvgAbc;

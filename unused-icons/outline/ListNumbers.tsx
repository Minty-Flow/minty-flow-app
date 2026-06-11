import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgListNumbers = (props: SvgProps) => (
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
    <Path d="M12 18h8" />
    <Path d="M4 16a2 2 0 1 1 4 0c0 .591 -.5 1 -1 1.5l-3 2.5h4" />
    <Path d="M6 10v-6l-2 2" />
  </Svg>
);
export default SvgListNumbers;

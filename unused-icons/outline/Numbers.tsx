import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgNumbers = (props: SvgProps) => (
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
    <Path d="M8 10v-7l-2 2" />
    <Path d="M6 16a2 2 0 1 1 4 0c0 .591 -.601 1.46 -1 2l-3 3h4" />
    <Path d="M15 14a2 2 0 1 0 2 -2a2 2 0 1 0 -2 -2" />
    <Path d="M6.5 10h3" />
  </Svg>
);
export default SvgNumbers;

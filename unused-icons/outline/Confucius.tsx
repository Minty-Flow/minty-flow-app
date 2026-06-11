import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgConfucius = (props: SvgProps) => (
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
    <Path d="M9 19l3 2v-18" />
    <Path d="M4 10l8 -2" />
    <Path d="M4 18l8 -10" />
    <Path d="M20 18l-8 -8l8 -4" />
  </Svg>
);
export default SvgConfucius;

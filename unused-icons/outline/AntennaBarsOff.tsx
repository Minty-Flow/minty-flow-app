import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgAntennaBarsOff = (props: SvgProps) => (
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
    <Path d="M6 18v-3" />
    <Path d="M10 18v-6" />
    <Path d="M14 18v-4" />
    <Path d="M14 10v-1" />
    <Path d="M18 14v-8" />
    <Path d="M3 3l18 18" />
  </Svg>
);
export default SvgAntennaBarsOff;

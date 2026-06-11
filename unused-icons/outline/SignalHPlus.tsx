import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgSignalHPlus = (props: SvgProps) => (
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
    <Path d="M7 16v-8" />
    <Path d="M11 8v8" />
    <Path d="M7 12h4" />
    <Path d="M14 12h4" />
    <Path d="M16 10v4" />
  </Svg>
);
export default SvgSignalHPlus;

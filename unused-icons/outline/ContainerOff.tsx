import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgContainerOff = (props: SvgProps) => (
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
    <Path d="M20 4v.01" />
    <Path d="M20 20v.01" />
    <Path d="M20 16v.01" />
    <Path d="M20 12v.01" />
    <Path d="M20 8v.01" />
    <Path d="M8.297 4.289a1 1 0 0 1 .703 -.289h6a1 1 0 0 1 1 1v7m0 4v3a1 1 0 0 1 -1 1h-6a1 1 0 0 1 -1 -1v-11" />
    <Path d="M4 4v.01" />
    <Path d="M4 20v.01" />
    <Path d="M4 16v.01" />
    <Path d="M4 12v.01" />
    <Path d="M4 8v.01" />
    <Path d="M3 3l18 18" />
  </Svg>
);
export default SvgContainerOff;

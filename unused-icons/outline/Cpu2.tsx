import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgCpu2 = (props: SvgProps) => (
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
    <Path d="M5 6a1 1 0 0 1 1 -1h12a1 1 0 0 1 1 1v12a1 1 0 0 1 -1 1h-12a1 1 0 0 1 -1 -1l0 -12" />
    <Path d="M8 10v-2h2m6 6v2h-2m-4 0h-2v-2m8 -4v-2h-2" />
    <Path d="M3 10h2" />
    <Path d="M3 14h2" />
    <Path d="M10 3v2" />
    <Path d="M14 3v2" />
    <Path d="M21 10h-2" />
    <Path d="M21 14h-2" />
    <Path d="M14 21v-2" />
    <Path d="M10 21v-2" />
  </Svg>
);
export default SvgCpu2;

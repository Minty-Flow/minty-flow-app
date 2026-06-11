import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgStethoscope = (props: SvgProps) => (
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
    <Path d="M6 4h-1a2 2 0 0 0 -2 2v3.5a5.5 5.5 0 0 0 11 0v-3.5a2 2 0 0 0 -2 -2h-1" />
    <Path d="M8 15a6 6 0 1 0 12 0v-3" />
    <Path d="M11 3v2" />
    <Path d="M6 3v2" />
    <Path d="M18 10a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
  </Svg>
);
export default SvgStethoscope;

import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgBrain = (props: SvgProps) => (
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
    <Path d="M15.5 13a3.5 3.5 0 0 0 -3.5 3.5v1a3.5 3.5 0 0 0 7 0v-1.8" />
    <Path d="M8.5 13a3.5 3.5 0 0 1 3.5 3.5v1a3.5 3.5 0 0 1 -7 0v-1.8" />
    <Path d="M17.5 16a3.5 3.5 0 0 0 0 -7h-.5" />
    <Path d="M19 9.3v-2.8a3.5 3.5 0 0 0 -7 0" />
    <Path d="M6.5 16a3.5 3.5 0 0 1 0 -7h.5" />
    <Path d="M5 9.3v-2.8a3.5 3.5 0 0 1 7 0v10" />
  </Svg>
);
export default SvgBrain;

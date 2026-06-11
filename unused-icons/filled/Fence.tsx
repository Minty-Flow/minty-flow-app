import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgFence = (props: SvgProps) => (
  <Svg
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    <Path d="M19 17v3a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1v-3z" />
    <Path d="M11 17v3a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1v-3z" />
    <Path d="M20 12a1 1 0 0 1 1 1v2a1 1 0 0 1 -1 1h-16a1 1 0 0 1 -1 -1v-2a1 1 0 0 1 1 -1z" />
    <Path d="M8.707 3.293l2 2a1 1 0 0 1 .293 .707v5h-6v-5a1 1 0 0 1 .293 -.707l2 -2a1 1 0 0 1 1.414 0" />
    <Path d="M16.707 3.293l2 2a1 1 0 0 1 .293 .707v5h-6v-5a1 1 0 0 1 .293 -.707l2 -2a1 1 0 0 1 1.414 0" />
  </Svg>
);
export default SvgFence;

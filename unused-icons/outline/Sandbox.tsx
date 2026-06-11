import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgSandbox = (props: SvgProps) => (
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
    <Path d="M19.953 8.017l1.047 6.983v2a3 3 0 0 1 -3 3h-12a3 3 0 0 1 -3 -3v-2l1.245 -8.297a2 2 0 0 1 1.977 -1.703h3.778" />
    <Path d="M3 15h18" />
    <Path d="M13 3l5.5 1.5" />
    <Path d="M15.75 3.75l-2 7" />
    <Path d="M7 10.5c1.667 -.667 3.333 -.667 5 0c1.667 .667 3.333 .667 5 0" />
  </Svg>
);
export default SvgSandbox;

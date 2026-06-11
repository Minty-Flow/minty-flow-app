import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgTimeDuration30 = (props: SvgProps) => (
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
    <Path d="M14 10.5v3a1.5 1.5 0 0 0 3 0v-3a1.5 1.5 0 0 0 -3 0" />
    <Path d="M8 9h1.5a1.5 1.5 0 0 1 0 3h-.5h.5a1.5 1.5 0 0 1 0 3h-1.5" />
    <Path d="M3 12v.01" />
    <Path d="M7.5 4.2v.01" />
    <Path d="M7.5 19.8v.01" />
    <Path d="M4.2 16.5v.01" />
    <Path d="M4.2 7.5v.01" />
    <Path d="M12 21a9 9 0 0 0 0 -18" />
  </Svg>
);
export default SvgTimeDuration30;

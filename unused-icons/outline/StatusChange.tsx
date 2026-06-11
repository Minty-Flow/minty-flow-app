import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgStatusChange = (props: SvgProps) => (
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
    <Path d="M4 18a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
    <Path d="M16 18a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
    <Path d="M6 12v-2a6 6 0 1 1 12 0v2" />
    <Path d="M15 9l3 3l3 -3" />
  </Svg>
);
export default SvgStatusChange;

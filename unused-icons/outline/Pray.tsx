import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgPray = (props: SvgProps) => (
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
    <Path d="M11 5a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
    <Path d="M7 20h8l-4 -4v-7l4 3l2 -2" />
  </Svg>
);
export default SvgPray;

import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgSort90 = (props: SvgProps) => (
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
    <Path d="M4 15a1 1 0 0 0 1 1h2a1 1 0 0 0 1 -1v-6a1 1 0 0 0 -1 -1h-2a1 1 0 0 0 -1 1v2a1 1 0 0 0 1 1h3" />
    <Path d="M16 10v4a2 2 0 1 0 4 0v-4a2 2 0 1 0 -4 0" />
    <Path d="M11 12h2" />
  </Svg>
);
export default SvgSort90;

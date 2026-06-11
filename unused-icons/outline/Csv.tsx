import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgCsv = (props: SvgProps) => (
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
    <Path d="M10 15a1 1 0 0 0 1 1h2a1 1 0 0 0 1 -1v-2a1 1 0 0 0 -1 -1h-2a1 1 0 0 1 -1 -1v-2a1 1 0 0 1 1 -1h2a1 1 0 0 1 1 1" />
    <Path d="M17 8l2 8l2 -8" />
    <Path d="M7 10a2 2 0 1 0 -4 0v4a2 2 0 1 0 4 0" />
  </Svg>
);
export default SvgCsv;

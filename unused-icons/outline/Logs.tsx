import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgLogs = (props: SvgProps) => (
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
    <Path d="M4 12h.01" />
    <Path d="M4 6h.01" />
    <Path d="M4 18h.01" />
    <Path d="M8 18h2" />
    <Path d="M8 12h2" />
    <Path d="M8 6h2" />
    <Path d="M14 6h6" />
    <Path d="M14 12h6" />
    <Path d="M14 18h6" />
  </Svg>
);
export default SvgLogs;

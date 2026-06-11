import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgBlade = (props: SvgProps) => (
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
    <Path d="M17.707 3.707l2.586 2.586a1 1 0 0 1 0 1.414l-.586 .586a1 1 0 0 0 0 1.414l.586 .586a1 1 0 0 1 0 1.414l-8.586 8.586a1 1 0 0 1 -1.414 0l-.586 -.586a1 1 0 0 0 -1.414 0l-.586 .586a1 1 0 0 1 -1.414 0l-2.586 -2.586a1 1 0 0 1 0 -1.414l.586 -.586a1 1 0 0 0 0 -1.414l-.586 -.586a1 1 0 0 1 0 -1.414l8.586 -8.586a1 1 0 0 1 1.414 0l.586 .586a1 1 0 0 0 1.414 0l.586 -.586a1 1 0 0 1 1.414 0" />
    <Path d="M8 16l3.2 -3.2" />
    <Path d="M12.8 11.2l3.2 -3.2" />
    <Path d="M14 8l2 2" />
    <Path d="M8 14l2 2" />
    <Path d="M11 12a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
  </Svg>
);
export default SvgBlade;
